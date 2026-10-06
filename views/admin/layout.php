<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e(ucfirst($page)) ?> — Bondor Bati Admin</title>
    <link rel="stylesheet" href="../assets/css/google_fonts_2.css">


    <link rel="stylesheet" href="../assets/css/admin-layout.css">
</head>
<body>

<!-- ── Sidebar overlay (mobile) ───────────────────────────────────────────── -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<!-- ── Sidebar ─────────────────────────────────────────────────────────────── -->
<nav class="sidebar" id="sidebar">
    <div class="sidebar-logo">
        <img src="../assets/logo.png" alt="Bondor Bati">
        <div class="sidebar-logo-text">
            <strong>Bondor Bati</strong>
            Admin Panel
        </div>
    </div>

    <div class="nav-section">
        <div class="nav-label">Navigation</div>

        <a href="index.php?page=dashboard" class="nav-item <?= $page === 'dashboard' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            Dashboard
        </a>

        <a href="index.php?page=menu" class="nav-item <?= $page === 'menu' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 11l19-9-9 19-2-8-8-2z"/>
            </svg>
            Menu Items
            <span class="nav-badge"><?= $counts['menu_items'] ?></span>
        </a>

        <a href="index.php?page=orders" class="nav-item <?= $page === 'orders' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            Orders
            <?php if ($counts['pending'] > 0): ?>
                <span class="nav-badge"><?= $counts['pending'] ?></span>
            <?php endif; ?>
        </a>
        <a href="index.php?page=testimonials" class="nav-item <?= $page === 'testimonials' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Success Stories
        </a>
        <a href="index.php?page=catering" class="nav-item <?= $page === 'catering' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Catering Bookings
            <?php if (isset($counts['catering_pending']) && $counts['catering_pending'] > 0): ?>
                <span class="nav-badge"><?= $counts['catering_pending'] ?></span>
            <?php endif; ?>
        </a>
        <a href="index.php?page=catering_menus" class="nav-item <?= $page === 'catering_menus' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Event Menus
        </a>
        <?php if (($_SESSION['admin_role'] ?? 'manager') === 'superadmin'): ?>
        <a href="index.php?page=admins" class="nav-item <?= $page === 'admins' ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Admins
        </a>
        <?php endif; ?>
    </div>

    <div class="nav-section" style="margin-top:.5rem;">
        <div class="nav-label">Links</div>
        <a href="../index.php" class="nav-item" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
            Customer Site
        </a>
    </div>

    <div class="sidebar-footer">
        <form method="POST" action="">
            <input type="hidden" name="_action" value="logout">
            <input type="hidden" name="_csrf" value="<?= e(csrfToken()) ?>">
            <button class="btn-logout" type="submit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                </svg>
                Logout
            </button>
        </form>
    </div>
</nav>

<!-- ── Main ────────────────────────────────────────────────────────────────── -->
<div class="main">
    <header class="topbar">
        <div style="display:flex; align-items:center; gap:.75rem;">
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle sidebar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
            </button>
            <span class="topbar-title">
                <?= match($page) {
                    'menu'           => 'Menu Management',
                    'orders'         => 'Orders',
                    'testimonials'   => 'Success Stories',
                    'catering'       => 'Catering Bookings',
                    'catering_menus' => 'Event Menus',
                    'admins'         => 'Admin Users',
                    default          => 'Dashboard'
                } ?>
            </span>
        </div>
        <div class="topbar-user">
            <span><?= e($_SESSION['admin_name'] ?? 'Admin') ?> (<?= ucfirst(e($_SESSION['admin_role'] ?? 'Manager')) ?>)</span>
            <div class="topbar-avatar"><?= strtoupper(substr($_SESSION['admin_name'] ?? 'A', 0, 1)) ?></div>
        </div>
    </header>

    <div class="content">

        <?php if ($flashSuccess): ?>
            <div class="alert alert-success">✓ <?= e($flashSuccess) ?></div>
        <?php endif; ?>
        <?php if ($flashError): ?>
            <div class="alert alert-error">✕ <?= e($flashError) ?></div>
        <?php endif; ?>

<?php /* PAGE CONTENT */ ?>
<?= $pageContent ?>
    </div><!-- /content -->
</div><!-- /main -->
<script src="../assets/js/admin-global.js"></script>
<?php if ($page === 'menu'): ?>
<script src="../assets/js/admin-menu.js"></script>
<?php elseif ($page === 'testimonials'): ?>
<script src="../assets/js/admin-testimonials.js"></script>
<?php endif; ?>
</body>
</html>
