<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use App\Domain\Entity\Order;
use App\Domain\Repository\OrderRepository;
use PDO;
use Throwable;

final readonly class PdoOrderRepository implements OrderRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function create(array $orderData, array $items): Order
    {
        $this->pdo->beginTransaction();
        try {
            $statement = $this->pdo->prepare(
                'INSERT INTO orders
                    (order_number, customer_name, phone, address, delivery_date, notes, subtotal,
                     delivery_fee, total, status, idempotency_key)
                 VALUES
                    (:order_number, :customer_name, :phone, :address, :delivery_date, :notes, :subtotal,
                     :delivery_fee, :total, :status, :idempotency_key)'
            );
            $statement->execute($orderData);
            $orderId = (int) $this->pdo->lastInsertId();

            $itemStatement = $this->pdo->prepare(
                'INSERT INTO order_items
                    (order_id, menu_item_id, item_name, tier, unit_price, quantity, line_total)
                 VALUES
                    (:order_id, :menu_item_id, :item_name, :tier, :unit_price, :quantity, :line_total)'
            );
            foreach ($items as $item) {
                $itemStatement->execute(['order_id' => $orderId] + $item);
            }

            $this->pdo->commit();
            return $this->findById($orderId);
        } catch (Throwable $exception) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $exception;
        }
    }

    public function findByNumberAndPhone(string $orderNumber, string $phone): ?Order
    {
        $statement = $this->pdo->prepare('SELECT * FROM orders WHERE order_number = ? AND phone = ? LIMIT 1');
        $statement->execute([$orderNumber, $phone]);
        $row = $statement->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    public function findByIdempotencyKey(string $key): ?Order
    {
        $statement = $this->pdo->prepare('SELECT * FROM orders WHERE idempotency_key = ? LIMIT 1');
        $statement->execute([$key]);
        $row = $statement->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    private function findById(int $id): Order
    {
        $statement = $this->pdo->prepare('SELECT * FROM orders WHERE id = ? LIMIT 1');
        $statement->execute([$id]);
        $row = $statement->fetch();
        if (!$row) {
            throw new \RuntimeException('Created order could not be loaded.');
        }
        return $this->hydrate($row);
    }

    /** @param array<string, mixed> $row */
    private function hydrate(array $row): Order
    {
        $statement = $this->pdo->prepare(
            'SELECT item_name, tier, unit_price, quantity, line_total
             FROM order_items WHERE order_id = ? ORDER BY id ASC'
        );
        $statement->execute([(int) $row['id']]);
        $items = array_map(static fn (array $item): array => [
            'item_name' => (string) $item['item_name'],
            'tier' => (string) $item['tier'],
            'unit_price' => (int) $item['unit_price'],
            'quantity' => (int) $item['quantity'],
            'line_total' => (int) $item['line_total'],
        ], $statement->fetchAll());

        return new Order(
            (int) $row['id'],
            (string) $row['order_number'],
            (string) $row['customer_name'],
            (string) $row['phone'],
            (string) $row['address'],
            (string) $row['delivery_date'],
            (string) $row['status'],
            (int) $row['subtotal'],
            (int) $row['delivery_fee'],
            (int) $row['total'],
            $items,
            $row['notes'] !== null ? (string) $row['notes'] : null,
            (string) $row['created_at'],
        );
    }
}

