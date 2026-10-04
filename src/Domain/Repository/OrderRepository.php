<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Order;

interface OrderRepository
{
    /** @param array<string, mixed> $orderData @param list<array<string, int|string>> $items */
    public function create(array $orderData, array $items): Order;

    public function findByNumberAndPhone(string $orderNumber, string $phone): ?Order;

    public function findByIdempotencyKey(string $key): ?Order;
}

