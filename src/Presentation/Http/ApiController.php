<?php

declare(strict_types=1);

namespace App\Presentation\Http;

use App\Application\DTO\CreateOrderInput;
use App\Application\UseCase\CreateOrder;
use App\Application\UseCase\ListWeeklyMenu;
use App\Application\UseCase\TrackOrder;
use DomainException;
use JsonException;
use Throwable;

final readonly class ApiController
{
    public function __construct(
        private ListWeeklyMenu $listWeeklyMenu,
        private CreateOrder $createOrder,
        private TrackOrder $trackOrder,
        private \App\Application\UseCase\CreateCateringBooking $createCateringBooking,
        private bool $debug = false,
    ) {
    }

    public function menu(): never
    {
        JsonResponse::send(['data' => $this->listWeeklyMenu->execute()]);
    }

    public function createOrder(): never
    {
        $this->verifyCsrf();
        $this->checkRateLimit();
        $body = $this->jsonBody();

        try {
            $order = $this->createOrder->execute(new CreateOrderInput(
                (string) ($body['customer_name'] ?? ''),
                (string) ($body['phone'] ?? ''),
                (string) ($body['address'] ?? ''),
                (string) ($body['delivery_date'] ?? ''),
                isset($body['notes']) ? (string) $body['notes'] : null,
                is_array($body['items'] ?? null) ? $body['items'] : [],
                (string) ($body['idempotency_key'] ?? ''),
            ));
            JsonResponse::send(['message' => 'Order placed successfully.', 'data' => $order->toArray()], 201);
        } catch (DomainException $exception) {
            JsonResponse::send(['message' => $exception->getMessage()], 422);
        }
    }

    public function createCateringBooking(): never
    {
        $this->verifyCsrf();
        $this->checkRateLimit();
        $body = $this->jsonBody();

        try {
            $booking = $this->createCateringBooking->execute(new \App\Application\DTO\CreateCateringBookingInput(
                (string) ($body['menu_name'] ?? ''),
                (int) ($body['guest_count'] ?? 0),
                (string) ($body['client_name'] ?? ''),
                (string) ($body['phone'] ?? ''),
                (string) ($body['event_date'] ?? ''),
                (string) ($body['venue'] ?? ''),
                isset($body['notes']) ? (string) $body['notes'] : null,
            ));
            JsonResponse::send(['message' => 'Inquiry sent! We will contact you soon.', 'data' => $booking->toArray()], 201);
        } catch (DomainException $exception) {
            JsonResponse::send(['message' => $exception->getMessage()], 422);
        }
    }
    public function trackOrder(): never
    {
        $orderNumber = (string) ($_GET['order_number'] ?? '');
        $phone = (string) ($_GET['phone'] ?? '');
        if ($orderNumber === '' || $phone === '') {
            JsonResponse::send(['message' => 'Order number and phone are required.'], 422);
        }

        $order = $this->trackOrder->execute($orderNumber, $phone);
        if ($order === null) {
            JsonResponse::send(['message' => 'No matching order was found.'], 404);
        }

        JsonResponse::send(['data' => $order->toArray()]);
    }

    /** @return array<string, mixed> */
    private function jsonBody(): array
    {
        try {
            $body = json_decode(file_get_contents('php://input') ?: '', true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            JsonResponse::send(['message' => 'The request body must be valid JSON.'], 400);
        }
        if (!is_array($body)) {
            JsonResponse::send(['message' => 'The request body must be a JSON object.'], 400);
        }
        return $body;
    }

    private function verifyCsrf(): void
    {
        $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $expected = $_SESSION['csrf_token'] ?? '';
        if ($expected === '' || !hash_equals($expected, $provided)) {
            JsonResponse::send(['message' => 'Your session expired. Refresh the page and try again.'], 419);
        }
    }

    private function checkRateLimit(): void
    {
        $now = time();
        $attempts = array_values(array_filter(
            $_SESSION['checkout_attempts'] ?? [],
            static fn (int $timestamp): bool => $timestamp > $now - 60,
        ));
        if (count($attempts) >= 8) {
            JsonResponse::send(['message' => 'Too many checkout attempts. Please wait a minute.'], 429);
        }
        $attempts[] = $now;
        $_SESSION['checkout_attempts'] = $attempts;
    }

    public function handleFailure(Throwable $exception): never
    {
        error_log($exception->__toString());
        $message = $this->debug ? $exception->getMessage() : 'The service is temporarily unavailable. Please try again.';
        JsonResponse::send(['message' => $message], 500);
    }
}

