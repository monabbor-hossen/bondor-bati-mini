<?php
namespace App\Controllers;

use App\Infrastructure\Persistence\MySQL\ConnectionFactory;
use PDO;

class FrontendController {
    public function index() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
        
        $db = ConnectionFactory::create();
        $stmt = $db->query('SELECT * FROM catering_menus WHERE is_active = 1 ORDER BY FIELD(category, "regular", "premium", "holud", "bride", "box"), id ASC');
        $cateringMenus = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt2 = $db->query('SELECT * FROM menu_items WHERE is_available = 1 ORDER BY day_index ASC, FIELD(tier, "standard", "premium") ASC');
        $menuItemsRaw = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        
        $weeklyMenus = [];
        for ($i=0; $i<6; $i++) {
            $weeklyMenus[$i] = [];
        }
        foreach ($menuItemsRaw as $item) {
            $weeklyMenus[$item['day_index']][] = $item;
        }
        
        $stmt3 = $db->query('SELECT * FROM success_stories WHERE is_visible = 1 ORDER BY id DESC');
        $successStories = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        
        require __DIR__ . '/../../views/frontend/home.php';
    }
}
