<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use PDO;

/**
 * Admin-only repository — not bound to any Domain interface.
 * All write operations go through this class.
 */
final readonly class PdoAdminRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    // ──────────────────────────────────────────────
    // Menu Items
    // ──────────────────────────────────────────────

    /** @return list<array<string, mixed>> */
    public function allMenuItems(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, day_index, day_name, tier, name, description, price, emoji, is_available, updated_at
             FROM menu_items
             ORDER BY day_index ASC, FIELD(tier, "standard", "premium")'
        );
        return $statement->fetchAll();
    }

    /** @param array<string, mixed> $data */
    public function saveMenuItem(array $data): void
    {
        $id = isset($data['id']) && (int) $data['id'] > 0 ? (int) $data['id'] : null;

        if ($id !== null) {
            $statement = $this->pdo->prepare(
                'UPDATE menu_items
                 SET day_index = :day_index, day_name = :day_name, tier = :tier,
                     name = :name, description = :description, price = :price, emoji = :emoji
                 WHERE id = :id'
            );
            $statement->execute([
                'id'          => $id,
                'day_index'   => (int) $data['day_index'],
                'day_name'    => (string) $data['day_name'],
                'tier'        => (string) $data['tier'],
                'name'        => (string) $data['name'],
                'description' => (string) $data['description'],
                'price'       => (int) $data['price'],
                'emoji'       => (string) $data['emoji'],
            ]);
        } else {
            $statement = $this->pdo->prepare(
                'INSERT INTO menu_items (day_index, day_name, tier, name, description, price, emoji, is_available)
                 VALUES (:day_index, :day_name, :tier, :name, :description, :price, :emoji, 1)'
            );
            $statement->execute([
                'day_index'   => (int) $data['day_index'],
                'day_name'    => (string) $data['day_name'],
                'tier'        => (string) $data['tier'],
                'name'        => (string) $data['name'],
                'description' => (string) $data['description'],
                'price'       => (int) $data['price'],
                'emoji'       => (string) $data['emoji'],
            ]);
        }
    }

    public function deleteMenuItem(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM menu_items WHERE id = ?');
        $statement->execute([$id]);
    }

    public function toggleMenuItemAvailability(int $id, bool $available): void
    {
        $statement = $this->pdo->prepare('UPDATE menu_items SET is_available = ? WHERE id = ?');
        $statement->execute([(int) $available, $id]);
    }

    /** @return array<string, mixed>|null */
    public function findMenuItemById(int $id): ?array
    {
        $statement = $this->pdo->prepare('SELECT * FROM menu_items WHERE id = ? LIMIT 1');
        $statement->execute([$id]);
        $row = $statement->fetch();
        return $row ?: null;
    }

    // ──────────────────────────────────────────────
    // Orders
    // ──────────────────────────────────────────────

    public function countOrders(?string $status = null): int
    {
        if ($status !== null) {
            $statement = $this->pdo->prepare('SELECT COUNT(*) FROM orders WHERE status = ?');
            $statement->execute([$status]);
        } else {
            $statement = $this->pdo->query('SELECT COUNT(*) FROM orders');
        }
        return (int) $statement->fetchColumn();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function allOrders(int $limit = 25, int $offset = 0, ?string $status = null): array
    {
        if ($status !== null) {
            $statement = $this->pdo->prepare(
                'SELECT id, order_number, customer_name, phone, address, delivery_date,
                        status, total, notes, created_at
                 FROM orders
                 WHERE status = ?
                 ORDER BY id DESC
                 LIMIT ? OFFSET ?'
            );
            $statement->execute([$status, $limit, $offset]);
        } else {
            $statement = $this->pdo->prepare(
                'SELECT id, order_number, customer_name, phone, address, delivery_date,
                        status, total, notes, created_at
                 FROM orders
                 ORDER BY id DESC
                 LIMIT ? OFFSET ?'
            );
            $statement->execute([$limit, $offset]);
        }
        return $statement->fetchAll();
    }

    /** @return list<array<string, mixed>> */
    public function orderItems(int $orderId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT item_name, tier, unit_price, quantity, line_total
             FROM order_items WHERE order_id = ? ORDER BY id ASC'
        );
        $statement->execute([$orderId]);
        return $statement->fetchAll();
    }

    public function updateOrderStatus(int $id, string $status): void
    {
        $allowed = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            throw new \DomainException('Invalid order status.');
        }
        $statement = $this->pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $statement->execute([$status, $id]);
    }

    // ──────────────────────────────────────────────
    // Dashboard summary
    // ──────────────────────────────────────────────

    /** @return array<string, int> */
    public function dashboardCounts(): array
    {
        $row = $this->pdo->query(
            "SELECT
                COUNT(*) AS total_orders,
                SUM(status = 'pending') AS pending,
                SUM(status = 'confirmed') AS confirmed,
                SUM(status = 'preparing') AS preparing,
                SUM(status = 'out_for_delivery') AS out_for_delivery,
                SUM(status = 'delivered') AS delivered,
                SUM(status = 'cancelled') AS cancelled
             FROM orders"
        )->fetch();

        $menuCount = (int) $this->pdo->query('SELECT COUNT(*) FROM menu_items')->fetchColumn();

        return [
            'total_orders'    => (int) ($row['total_orders'] ?? 0),
            'pending'         => (int) ($row['pending'] ?? 0),
            'confirmed'       => (int) ($row['confirmed'] ?? 0),
            'preparing'       => (int) ($row['preparing'] ?? 0),
            'out_for_delivery'=> (int) ($row['out_for_delivery'] ?? 0),
            'delivered'       => (int) ($row['delivered'] ?? 0),
            'cancelled'       => (int) ($row['cancelled'] ?? 0),
            'menu_items'      => $menuCount,
        ];
    }

    /** @return list<array<string, mixed>> Revenue for last 7 days */
    public function recentRevenue(): array
    {
        $statement = $this->pdo->query(
            "SELECT DATE(delivery_date) AS day, SUM(total) AS revenue, COUNT(*) AS orders
             FROM orders
             WHERE status NOT IN ('cancelled')
               AND delivery_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(delivery_date)
             ORDER BY day ASC"
        );
        return $statement->fetchAll();
    }

    // ──────────────────────────────────────────────
    // Success Stories
    // ──────────────────────────────────────────────

    /** @return list<array<string, mixed>> */
    public function allSuccessStories(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, client_name, rating, content, is_visible, created_at, updated_at
             FROM success_stories
             ORDER BY created_at DESC'
        );
        return $statement->fetchAll();
    }

    /** @return list<array<string, mixed>> */
    public function visibleSuccessStories(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, client_name, rating, content, created_at
             FROM success_stories
             WHERE is_visible = 1
             ORDER BY created_at DESC'
        );
        return $statement->fetchAll();
    }

    /** @param array<string, mixed> $data */
    public function saveSuccessStory(array $data): void
    {
        $id = isset($data['id']) && (int) $data['id'] > 0 ? (int) $data['id'] : null;

        if ($id !== null) {
            $statement = $this->pdo->prepare(
                'UPDATE success_stories
                 SET client_name = :client_name, rating = :rating, content = :content
                 WHERE id = :id'
            );
            $statement->execute([
                'id'          => $id,
                'client_name' => (string) $data['client_name'],
                'rating'      => (int) $data['rating'],
                'content'     => (string) $data['content'],
            ]);
        } else {
            $statement = $this->pdo->prepare(
                'INSERT INTO success_stories (client_name, rating, content, is_visible)
                 VALUES (:client_name, :rating, :content, 1)'
            );
            $statement->execute([
                'client_name' => (string) $data['client_name'],
                'rating'      => (int) $data['rating'],
                'content'     => (string) $data['content'],
            ]);
        }
    }

    public function deleteSuccessStory(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM success_stories WHERE id = ?');
        $statement->execute([$id]);
    }

    public function toggleSuccessStoryVisibility(int $id, bool $visible): void
    {
        $statement = $this->pdo->prepare('UPDATE success_stories SET is_visible = ? WHERE id = ?');
        $statement->execute([(int) $visible, $id]);
    }

    // ──────────────────────────────────────────────
    // Catering Bookings
    // ──────────────────────────────────────────────

    public function countCateringBookings(?string $status = null): int
    {
        if ($status !== null) {
            $statement = $this->pdo->prepare('SELECT COUNT(*) FROM catering_bookings WHERE status = ?');
            $statement->execute([$status]);
        } else {
            $statement = $this->pdo->query('SELECT COUNT(*) FROM catering_bookings');
        }
        return (int) $statement->fetchColumn();
    }

    /** @return list<array<string, mixed>> */
    public function allCateringBookings(int $limit = 25, int $offset = 0, ?string $status = null): array
    {
        if ($status !== null) {
            $statement = $this->pdo->prepare(
                'SELECT id, booking_number, menu_name, guest_count, client_name, phone,
                        event_date, venue, notes, status, created_at
                 FROM catering_bookings
                 WHERE status = ?
                 ORDER BY id DESC
                 LIMIT ? OFFSET ?'
            );
            $statement->execute([$status, $limit, $offset]);
        } else {
            $statement = $this->pdo->prepare(
                'SELECT id, booking_number, menu_name, guest_count, client_name, phone,
                        event_date, venue, notes, status, created_at
                 FROM catering_bookings
                 ORDER BY id DESC
                 LIMIT ? OFFSET ?'
            );
            $statement->execute([$limit, $offset]);
        }
        return $statement->fetchAll();
    }

    public function updateCateringStatus(int $id, string $status): void
    {
        $allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            throw new \DomainException('Invalid catering booking status.');
        }
        $statement = $this->pdo->prepare('UPDATE catering_bookings SET status = ? WHERE id = ?');
        $statement->execute([$status, $id]);
    }

    // ──────────────────────────────────────────────
    // Catering Menus
    // ──────────────────────────────────────────────

    public function allCateringMenus(): array
    {
        $statement = $this->pdo->query('SELECT * FROM catering_menus ORDER BY FIELD(category, "regular", "premium", "holud", "bride", "box"), id ASC');
        return $statement->fetchAll();
    }

    public function saveCateringMenu(array $data): void
    {
        $id = isset($data['id']) && (int) $data['id'] > 0 ? (int) $data['id'] : null;

        if ($id !== null) {
            $statement = $this->pdo->prepare(
                'UPDATE catering_menus SET category = ?, badge_text = ?, title = ?, items = ? WHERE id = ?'
            );
            $statement->execute([$data['category'], $data['badge_text'], $data['title'], $data['items'], $id]);
        } else {
            $statement = $this->pdo->prepare(
                'INSERT INTO catering_menus (category, badge_text, title, items, is_active) VALUES (?, ?, ?, ?, 1)'
            );
            $statement->execute([$data['category'], $data['badge_text'], $data['title'], $data['items']]);
        }
    }

    public function deleteCateringMenu(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM catering_menus WHERE id = ?');
        $statement->execute([$id]);
    }

    public function toggleCateringMenuStatus(int $id, bool $isActive): void
    {
        $statement = $this->pdo->prepare('UPDATE catering_menus SET is_active = ? WHERE id = ?');
        $statement->execute([(int) $isActive, $id]);
    }

        // ──────────────────────────────────────────────
    // Admins
    // ──────────────────────────────────────────────

    public function getAdminByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM admins WHERE username = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function allAdmins(): array
    {
        $stmt = $this->pdo->query('SELECT id, name, username, email, role, is_active, created_at FROM admins ORDER BY id ASC');
        return $stmt->fetchAll();
    }

    public function saveAdmin(array $data): void
    {
        $id = isset($data['id']) && (int) $data['id'] > 0 ? (int) $data['id'] : null;

        if ($id !== null) {
            if (!empty($data['password_hash'])) {
                $stmt = $this->pdo->prepare('UPDATE admins SET name = ?, username = ?, email = ?, password_hash = ?, role = ? WHERE id = ?');
                $stmt->execute([$data['name'], $data['username'], $data['email'], $data['password_hash'], $data['role'], $id]);
            } else {
                $stmt = $this->pdo->prepare('UPDATE admins SET name = ?, username = ?, email = ?, role = ? WHERE id = ?');
                $stmt->execute([$data['name'], $data['username'], $data['email'], $data['role'], $id]);
            }
        } else {
            $stmt = $this->pdo->prepare('INSERT INTO admins (name, username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)');
            $stmt->execute([$data['name'], $data['username'], $data['email'], $data['password_hash'], $data['role']]);
        }
    }

    public function deleteAdmin(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM admins WHERE id = ?');
        $stmt->execute([$id]);
    }
    
    public function toggleAdminStatus(int $id, bool $isActive): void
    {
        $stmt = $this->pdo->prepare('UPDATE admins SET is_active = ? WHERE id = ?');
        $stmt->execute([(int) $isActive, $id]);
    }

    public function deleteCateringBooking(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM catering_bookings WHERE id = ?');
        $statement->execute([$id]);
    }
}
