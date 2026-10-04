<?php

declare(strict_types=1);

namespace App\Domain\Entity;

final readonly class Order
{
    /** @param list<array<string, int|string>> $items */
    public function __construct(
        public int $id,
        public string $orderNumber,
        public string $customerName,
        public string $phone,
        public string $address,
        public string $deliveryDate,
        public string $status,
        public int $subtotal,
        public int $deliveryFee,
        public int $total,
        public array $items,
        public ?string $notes,
        public string $createdAt,
    ) {
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'order_number' => $this->orderNumber,
            'customer_name' => $this->customerName,
            'phone' => $this->phone,
            'address' => $this->address,
            'delivery_date' => $this->deliveryDate,
            'status' => $this->status,
            'subtotal' => $this->subtotal,
            'delivery_fee' => $this->deliveryFee,
            'total' => $this->total,
            'items' => $this->items,
            'notes' => $this->notes,
            'created_at' => $this->createdAt,
        ];
    }
}

