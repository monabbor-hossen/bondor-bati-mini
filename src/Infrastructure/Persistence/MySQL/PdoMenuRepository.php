<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use App\Domain\Entity\MenuItem;
use App\Domain\Repository\MenuRepository;
use PDO;

final readonly class PdoMenuRepository implements MenuRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function availableItems(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, day_index, day_name, tier, name, description, price, emoji, image_url, is_available
             FROM menu_items
             WHERE is_available = 1
             ORDER BY day_index ASC, FIELD(tier, "standard", "premium"), id ASC'
        );

        return array_map($this->hydrate(...), $statement->fetchAll());
    }

    public function availableItemsByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $statement = $this->pdo->prepare(
            "SELECT id, day_index, day_name, tier, name, description, price, emoji, image_url, is_available
             FROM menu_items WHERE is_available = 1 AND id IN ($placeholders)"
        );
        $statement->execute(array_values($ids));

        $items = [];
        foreach ($statement->fetchAll() as $row) {
            $item = $this->hydrate($row);
            $items[$item->id] = $item;
        }
        return $items;
    }

    /** @param array<string, mixed> $row */
    private function hydrate(array $row): MenuItem
    {
        return new MenuItem(
            (int) $row['id'],
            (int) $row['day_index'],
            (string) $row['day_name'],
            (string) $row['tier'],
            (string) $row['name'],
            (string) $row['description'],
            (int) $row['price'],
            (string) $row['emoji'],
            $row['image_url'] ? (string) $row['image_url'] : null,
            (bool) $row['is_available'],
        );
    }
}

