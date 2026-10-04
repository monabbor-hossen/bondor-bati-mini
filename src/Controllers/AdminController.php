<?php
declare(strict_types=1);
namespace App\Controllers;

use App\Infrastructure\Persistence\MySQL\ConnectionFactory;
use App\Infrastructure\Persistence\MySQL\PdoAdminRepository;

class AdminController
{
    // ── Helpers ───────────────────────────────────────────────────────────────

    private function e(mixed $v): string
    {
        return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    private function redirect(string $url): never
    {
        header('Location: ' . $url);
        exit;
    }

    private function csrfToken(): string
    {
        $_SESSION['admin_csrf'] ??= bin2hex(random_bytes(32));
        return $_SESSION['admin_csrf'];
    }

    private function verifyCsrf(): void
    {
        $token    = $_POST['_csrf'] ?? '';
        $expected = $_SESSION['admin_csrf'] ?? '';
        if ($expected === '' || !hash_equals($expected, $token)) {
            $_SESSION['flash_error'] = 'Security token mismatch. Please try again.';
            $this->redirect($_SERVER['REQUEST_URI']);
        }
    }

    private function flash(): array
    {
        $success = $_SESSION['flash_success'] ?? null;
        $error   = $_SESSION['flash_error']   ?? null;
        unset($_SESSION['flash_success'], $_SESSION['flash_error']);
        return [$success, $error];
    }

    private function render(string $view, array $data = []): void
    {
        // Make helper functions available in views
        $e         = fn(mixed $v) => $this->e($v);
        $csrfToken = fn() => $this->csrfToken();

        extract($data);

        $viewFile = dirname(__DIR__, 2) . "/views/admin/{$view}.php";
        if (!file_exists($viewFile)) {
            http_response_code(404);
            echo "View not found: " . $this->e($view);
            exit;
        }

        // For page views: capture into $pageContent, then load layout
        if ($view !== 'login') {
            ob_start();
            require $viewFile;
            $pageContent = ob_get_clean();
            require dirname(__DIR__, 2) . '/views/admin/layout.php';
        } else {
            require $viewFile;
        }
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    public function handleRequest(): void
    {
        // Session must be configured before bootstrap starts it
        if (session_status() === PHP_SESSION_NONE) {
            session_name('bondor_bati_admin');
            session_set_cookie_params([
                'httponly' => true,
                'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
                'samesite' => 'Lax',
                'path'     => '/',
            ]);
        }

        $isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

        // ── Auth actions (no CSRF check needed here – login/logout) ──────────
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $action = $_POST['_action'] ?? '';

            if ($action === 'login') {
                $username = trim($_POST['username'] ?? '');
                $password = $_POST['password'] ?? '';
                $pdo      = ConnectionFactory::create();
                $repo     = new PdoAdminRepository($pdo);
                $row      = $repo->getAdminByUsername($username);

                if ($row !== null && password_verify($password, $row['password_hash'])) {
                    session_regenerate_id(true);
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id']        = $row['id'];
                    $_SESSION['admin_name']      = $row['name'];
                    $_SESSION['admin_role']      = $row['role'];
                    $_SESSION['admin_csrf']      = bin2hex(random_bytes(32));
                    $this->redirect('index.php');
                }

                $_SESSION['flash_error'] = 'Invalid username or password.';
                $this->redirect('index.php');
            }

            if ($action === 'logout' && $isLoggedIn) {
                session_destroy();
                $this->redirect('index.php');
            }
        }

        // ── Guard ─────────────────────────────────────────────────────────────
        if (!$isLoggedIn) {
            [$flashSuccess, $flashError] = $this->flash();
            $this->render('login', compact('flashSuccess', 'flashError'));
            exit;
        }

        // ── Authenticated POST actions ─────────────────────────────────────────
        $pdo  = ConnectionFactory::create();
        $repo = new PdoAdminRepository($pdo);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->verifyCsrf();
            $this->handlePost($repo);
        }

        // ── Routing & data fetching ───────────────────────────────────────────
        $page = match ($_GET['page'] ?? 'dashboard') {
            'menu'           => 'menu',
            'orders'         => 'orders',
            'testimonials'   => 'testimonials',
            'catering'       => 'catering',
            'catering_menus' => 'catering_menus',
            'admins'         => 'admins',
            default          => 'dashboard',
        };

        $perPage      = 20;
        $pageNum      = max(1, (int) ($_GET['p'] ?? 1));
        $offset       = ($pageNum - 1) * $perPage;
        $filterStatus = $_GET['status'] ?? '';

        [$flashSuccess, $flashError] = $this->flash();

        $counts = $repo->dashboardCounts();
        $counts['catering_pending'] = $repo->countCateringBookings('pending');

        $menuItems     = $page === 'menu'           ? $repo->allMenuItems() : [];
        $orders        = $page === 'orders'         ? $repo->allOrders($perPage, $offset, $filterStatus ?: null) : [];
        $totalOrders   = $page === 'orders'         ? $repo->countOrders($filterStatus ?: null) : 0;
        $totalPages    = (int) ceil($totalOrders / $perPage);
        $revenue       = $page === 'dashboard'      ? $repo->recentRevenue() : [];
        $recentOrders  = $page === 'dashboard'      ? $repo->allOrders(5, 0) : [];
        $successStories       = $page === 'testimonials'   ? $repo->allSuccessStories() : [];
        $cateringBookings     = $page === 'catering'       ? $repo->allCateringBookings($perPage, $offset, $filterStatus ?: null) : [];
        $totalCatering        = $page === 'catering'       ? $repo->countCateringBookings($filterStatus ?: null) : 0;
        $totalCateringPages   = (int) ceil($totalCatering / $perPage);
        $cateringMenus        = $page === 'catering_menus' ? $repo->allCateringMenus() : [];
        $adminUsers           = $page === 'admins'         ? $repo->allAdmins() : [];

        $dayNames = [
            '0' => 'শনি (Sat)', '1' => 'রবি (Sun)', '2' => 'সোম (Mon)',
            '3' => 'মঙ্গল (Tue)', '4' => 'বুধ (Wed)', '5' => 'বৃহঃ (Thu)',
        ];
        $statusLabels = [
            'pending'         => 'Pending',
            'confirmed'       => 'Confirmed',
            'preparing'       => 'Preparing',
            'out_for_delivery'=> 'Out for Delivery',
            'delivered'       => 'Delivered',
            'cancelled'       => 'Cancelled',
        ];
        $statusColors = [
            'pending'         => '#f59e0b',
            'confirmed'       => '#3b82f6',
            'preparing'       => '#8b5cf6',
            'out_for_delivery'=> '#ec4899',
            'delivered'       => '#22c55e',
            'cancelled'       => '#6b7280',
        ];

        $this->render($page, compact(
            'page', 'pageNum', 'perPage', 'offset', 'filterStatus',
            'flashSuccess', 'flashError',
            'counts', 'revenue', 'recentOrders',
            'menuItems',
            'orders', 'totalOrders', 'totalPages',
            'successStories',
            'cateringBookings', 'totalCatering', 'totalCateringPages',
            'cateringMenus',
            'adminUsers',
            'dayNames', 'statusLabels', 'statusColors'
        ));
    }

    // ── POST action dispatch ──────────────────────────────────────────────────

    private function handlePost(PdoAdminRepository $repo): void
    {
        $action = $_POST['_action'] ?? '';
        $redirectPage = $_POST['_page'] ?? 'dashboard';

        try {
            switch ($action) {
                case 'save_menu_item':
                    $repo->saveMenuItem([
                        'id'          => $_POST['id'] ?? null,
                        'day_index'   => (int)  ($_POST['day_index']   ?? 0),
                        'day_name'    => trim(   $_POST['day_name']    ?? ''),
                        'tier'        =>          $_POST['tier']        ?? 'standard',
                        'name'        => trim(   $_POST['name']        ?? ''),
                        'description' => trim(   $_POST['description'] ?? ''),
                        'price'       => (int)  ($_POST['price']       ?? 0),
                        'emoji'       => trim(   $_POST['emoji']       ?? '🍱'),
                    ]);
                    $_SESSION['flash_success'] = 'Menu item saved.';
                    break;

                case 'delete_menu_item':
                    $repo->deleteMenuItem((int) ($_POST['id'] ?? 0));
                    $_SESSION['flash_success'] = 'Menu item deleted.';
                    break;

                case 'toggle_menu_item':
                    $repo->toggleMenuItemAvailability(
                        (int)  ($_POST['id']        ?? 0),
                        (bool) ($_POST['available'] ?? 0)
                    );
                    $_SESSION['flash_success'] = 'Availability updated.';
                    break;

                case 'save_catering_menu':
                    $repo->saveCateringMenu([
                        'id'         => $_POST['id']         ?? null,
                        'category'   => trim($_POST['category']   ?? ''),
                        'badge_text' => trim($_POST['badge_text'] ?? ''),
                        'title'      => trim($_POST['title']      ?? ''),
                        'items'      => trim($_POST['items']      ?? ''),
                    ]);
                    $_SESSION['flash_success'] = 'Catering menu saved.';
                    break;

                case 'delete_catering_menu':
                    $repo->deleteCateringMenu((int) ($_POST['id'] ?? 0));
                    $_SESSION['flash_success'] = 'Catering menu deleted.';
                    break;

                case 'toggle_catering_menu':
                    $repo->toggleCateringMenuStatus(
                        (int)  ($_POST['id']        ?? 0),
                        (bool) ($_POST['is_active'] ?? 0)
                    );
                    $_SESSION['flash_success'] = 'Menu visibility updated.';
                    break;

                case 'update_order_status':
                    $repo->updateOrderStatus(
                        (int)    ($_POST['id']     ?? 0),
                        (string) ($_POST['status'] ?? '')
                    );
                    $_SESSION['flash_success'] = 'Order status updated.';
                    break;

                case 'save_success_story':
                    $repo->saveSuccessStory([
                        'id'          => $_POST['id']          ?? null,
                        'client_name' => trim($_POST['client_name'] ?? ''),
                        'rating'      => (int) ($_POST['rating']    ?? 5),
                        'content'     => trim($_POST['content']     ?? ''),
                    ]);
                    $_SESSION['flash_success'] = 'Success story saved.';
                    break;

                case 'delete_success_story':
                    $repo->deleteSuccessStory((int) ($_POST['id'] ?? 0));
                    $_SESSION['flash_success'] = 'Success story deleted.';
                    break;

                case 'toggle_success_story':
                    $repo->toggleSuccessStoryVisibility(
                        (int)  ($_POST['id']      ?? 0),
                        (bool) ($_POST['visible'] ?? 0)
                    );
                    $_SESSION['flash_success'] = 'Visibility updated.';
                    break;

                case 'update_catering_status':
                    $repo->updateCateringStatus(
                        (int)    ($_POST['id']     ?? 0),
                        (string) ($_POST['status'] ?? '')
                    );
                    $_SESSION['flash_success'] = 'Catering status updated.';
                    break;

                case 'delete_catering_booking':
                    $repo->deleteCateringBooking((int) ($_POST['id'] ?? 0));
                    $_SESSION['flash_success'] = 'Catering booking deleted.';
                    break;

                case 'save_admin':
                    $this->requireSuperAdmin();
                    $data = [
                        'id'       => $_POST['id']       ?? null,
                        'name'     => trim($_POST['name']     ?? ''),
                        'username' => trim($_POST['username'] ?? ''),
                        'email'    => trim($_POST['email']    ?? ''),
                        'role'     =>      $_POST['role']     ?? 'manager',
                    ];
                    if (!empty($_POST['password'])) {
                        $data['password_hash'] = password_hash($_POST['password'], PASSWORD_BCRYPT);
                    }
                    $repo->saveAdmin($data);
                    $_SESSION['flash_success'] = 'Admin user saved.';
                    break;

                case 'delete_admin':
                    $this->requireSuperAdmin();
                    $repo->deleteAdmin((int) ($_POST['id'] ?? 0));
                    $_SESSION['flash_success'] = 'Admin user deleted.';
                    break;

                case 'toggle_admin_status':
                    $this->requireSuperAdmin();
                    $repo->toggleAdminStatus(
                        (int)  ($_POST['id']        ?? 0),
                        (bool) ($_POST['is_active'] ?? 0)
                    );
                    $_SESSION['flash_success'] = 'Admin status updated.';
                    break;

                default:
                    $_SESSION['flash_error'] = 'Unknown action.';
            }
        } catch (\Throwable $ex) {
            $_SESSION['flash_error'] = $ex->getMessage();
        }

        $this->redirect("index.php?page={$redirectPage}");
    }

    private function requireSuperAdmin(): void
    {
        if (($_SESSION['admin_role'] ?? 'manager') !== 'superadmin') {
            throw new \RuntimeException('Only Super Admins can perform this action.');
        }
    }
}
