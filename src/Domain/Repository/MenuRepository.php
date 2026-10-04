<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\MenuItem;

interface MenuRepository
{
    /** @return list<MenuItem> */
    public function availableItems(): array;

    /** @param list<int> $ids @return array<int, MenuItem> */
    public function availableItemsByIds(array $ids): array;
}

