<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use App\Domain\Repository\FrontendDataRepository;
use PDO;

final class PdoFrontendDataRepository implements FrontendDataRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function getActiveCateringMenus(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM catering_menus WHERE is_active = 1 ORDER BY FIELD(category, "regular", "premium", "holud", "bride", "box"), id ASC');
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function getAvailableMenuItems(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM menu_items WHERE is_available = 1 ORDER BY day_index ASC, FIELD(tier, "standard", "premium") ASC');
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function getVisibleSuccessStories(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM success_stories WHERE is_visible = 1 ORDER BY id DESC');
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
