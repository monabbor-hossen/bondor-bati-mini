<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\MenuRepository;

final readonly class ListWeeklyMenu
{
    public function __construct(private MenuRepository $menuRepository)
    {
    }

    /** @return array<int, array{day_index:int, day_name:string, items:list<array<string, mixed>>}> */
    public function execute(): array
    {
        $days = [];
        foreach ($this->menuRepository->availableItems() as $item) {
            $days[$item->dayIndex] ??= [
                'day_index' => $item->dayIndex,
                'day_name' => $item->dayName,
                'items' => [],
            ];
            $days[$item->dayIndex]['items'][] = $item->toArray();
        }

        ksort($days);
        return array_values($days);
    }
}

