<?php

declare(strict_types=1);

namespace App\Domain\Entity;

final readonly class MenuItem
{
    public function __construct(
        public int $id,
        public int $dayIndex,
        public string $dayName,
        public string $tier,
        public string $name,
        public string $description,
        public int $price,
        public string $emoji,
        public bool $isAvailable,
    ) {
    }

    /** @return array<string, int|string|bool> */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'day_index' => $this->dayIndex,
            'day_name' => $this->dayName,
            'tier' => $this->tier,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'emoji' => $this->emoji,
            'is_available' => $this->isAvailable,
        ];
    }
}

