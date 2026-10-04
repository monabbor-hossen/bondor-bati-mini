<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\CreateOrderInput;
use App\Domain\Entity\Order;
use App\Domain\Repository\MenuRepository;
use App\Domain\Repository\OrderRepository;
use DateTimeImmutable;
use DomainException;

final readonly class CreateOrder
{
    private const DAY_TO_ISO_WEEKDAY = [0 => 6, 1 => 7, 2 => 1, 3 => 2, 4 => 3, 5 => 4];

    public function __construct(
        private MenuRepository $menuRepository,
        private OrderRepository $orderRepository,
    ) {
    }

    public function execute(CreateOrderInput $input): Order
    {
        $this->validateCustomer($input);

        $existing = $this->orderRepository->findByIdempotencyKey($input->idempotencyKey);
        if ($existing !== null) {
            return $existing;
        }

        $quantities = [];
        foreach ($input->items as $line) {
            if (!is_array($line)) {
                throw new DomainException('Each cart item must contain an item and quantity.');
            }
            $itemId = (int) ($line['item_id'] ?? 0);
            $quantity = (int) ($line['quantity'] ?? 0);
            if ($itemId < 1 || $quantity < 1 || $quantity > 20) {
                throw new DomainException('Each cart item must have a valid item and a quantity from 1 to 20.');
            }
            $combinedQuantity = ($quantities[$itemId] ?? 0) + $quantity;
            if ($combinedQuantity > 20) {
                throw new DomainException('No more than 20 portions of one menu item can be ordered online.');
            }
            $quantities[$itemId] = $combinedQuantity;
        }

        if ($quantities === [] || count($quantities) > 20) {
            throw new DomainException('Your cart must contain between 1 and 20 different items.');
        }

        $menuItems = $this->menuRepository->availableItemsByIds(array_keys($quantities));
        if (count($menuItems) !== count($quantities)) {
            throw new DomainException('One or more menu items are no longer available. Refresh the menu and try again.');
        }

        $deliveryDate = $this->validatedDeliveryDate($input->deliveryDate);
        $deliveryWeekday = (int) $deliveryDate->format('N');
        $orderItems = [];
        $subtotal = 0;

        foreach ($menuItems as $itemId => $menuItem) {
            if (self::DAY_TO_ISO_WEEKDAY[$menuItem->dayIndex] !== $deliveryWeekday) {
                throw new DomainException('All items must match the selected delivery day.');
            }

            $quantity = $quantities[$itemId];
            $lineTotal = $menuItem->price * $quantity;
            $subtotal += $lineTotal;
            $orderItems[] = [
                'menu_item_id' => $itemId,
                'item_name' => $menuItem->name,
                'tier' => $menuItem->tier,
                'unit_price' => $menuItem->price,
                'quantity' => $quantity,
                'line_total' => $lineTotal,
            ];
        }

        if ($subtotal > 100000) {
            throw new DomainException('The order total exceeds the online ordering limit. Please call us for a bulk order.');
        }

        return $this->orderRepository->create([
            'order_number' => $this->generateOrderNumber(),
            'customer_name' => trim($input->customerName),
            'phone' => $this->normalizePhone($input->phone),
            'address' => trim($input->address),
            'delivery_date' => $deliveryDate->format('Y-m-d'),
            'notes' => $input->notes !== null && trim($input->notes) !== '' ? trim($input->notes) : null,
            'subtotal' => $subtotal,
            'delivery_fee' => 0,
            'total' => $subtotal,
            'status' => 'pending',
            'idempotency_key' => $input->idempotencyKey,
        ], $orderItems);
    }

    private function validateCustomer(CreateOrderInput $input): void
    {
        $nameLength = mb_strlen(trim($input->customerName));
        if ($nameLength < 2 || $nameLength > 100) {
            throw new DomainException('Customer name must be between 2 and 100 characters.');
        }

        if (!preg_match('/^(?:\+?88)?01[3-9]\d{8}$/', preg_replace('/[\s-]+/', '', $input->phone))) {
            throw new DomainException('Enter a valid Bangladeshi mobile number.');
        }

        $addressLength = mb_strlen(trim($input->address));
        if ($addressLength < 10 || $addressLength > 500) {
            throw new DomainException('Delivery address must be between 10 and 500 characters.');
        }

        if ($input->notes !== null && mb_strlen($input->notes) > 500) {
            throw new DomainException('Order notes cannot exceed 500 characters.');
        }

        if (!preg_match('/^[a-f0-9-]{20,80}$/i', $input->idempotencyKey)) {
            throw new DomainException('Invalid checkout request. Please refresh and try again.');
        }
    }

    private function validatedDeliveryDate(string $value): DateTimeImmutable
    {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        if ($date === false || $date->format('Y-m-d') !== $value) {
            throw new DomainException('Choose a valid delivery date.');
        }

        $today = new DateTimeImmutable('today');
        $lastDay = $today->modify('+14 days');
        if ($date < $today || $date > $lastDay) {
            throw new DomainException('Delivery date must be within the next 14 days.');
        }

        if ((int) $date->format('N') === 5) {
            throw new DomainException('The kitchen is closed on Friday. Please choose another day.');
        }

        return $date;
    }

    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[\s-]+/', '', $phone) ?? $phone;
        if (str_starts_with($phone, '+88')) {
            return substr($phone, 3);
        }
        if (str_starts_with($phone, '88') && strlen($phone) === 13) {
            return substr($phone, 2);
        }
        return $phone;
    }

    private function generateOrderNumber(): string
    {
        return 'BB-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
    }
}
