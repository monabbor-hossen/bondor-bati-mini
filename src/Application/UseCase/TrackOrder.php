<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Order;
use App\Domain\Repository\OrderRepository;

final readonly class TrackOrder
{
    public function __construct(private OrderRepository $orderRepository)
    {
    }

    public function execute(string $orderNumber, string $phone): ?Order
    {
        $orderNumber = strtoupper(trim($orderNumber));
        $phone = preg_replace('/[\s-]+/', '', $phone) ?? $phone;
        if (str_starts_with($phone, '+88')) {
            $phone = substr($phone, 3);
        } elseif (str_starts_with($phone, '88') && strlen($phone) === 13) {
            $phone = substr($phone, 2);
        }

        if (!preg_match('/^BB-\d{6}-[A-F0-9]{6}$/', $orderNumber) || !preg_match('/^01[3-9]\d{8}$/', $phone)) {
            return null;
        }

        return $this->orderRepository->findByNumberAndPhone($orderNumber, $phone);
    }
}
