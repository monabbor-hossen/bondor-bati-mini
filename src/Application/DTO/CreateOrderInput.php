<?php

declare(strict_types=1);

namespace App\Application\DTO;

final readonly class CreateOrderInput
{
    /** @param list<array{item_id:int, quantity:int}> $items */
    public function __construct(
        public string $customerName,
        public string $phone,
        public string $address,
        public string $deliveryDate,
        public ?string $notes,
        public array $items,
        public string $idempotencyKey,
    ) {
    }
}

