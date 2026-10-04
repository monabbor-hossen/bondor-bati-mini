<?php

declare(strict_types=1);

use App\Application\UseCase\CreateOrder;
use App\Application\UseCase\ListWeeklyMenu;
use App\Application\UseCase\TrackOrder;
use App\Infrastructure\Config\Environment;
use App\Infrastructure\Persistence\MySQL\ConnectionFactory;
use App\Infrastructure\Persistence\MySQL\PdoMenuRepository;
use App\Infrastructure\Persistence\MySQL\PdoOrderRepository;
use App\Infrastructure\Persistence\MySQL\PdoCateringBookingRepository;
use App\Application\UseCase\CreateCateringBooking;
use App\Presentation\Http\ApiController;
use App\Presentation\Http\JsonResponse;

require dirname(__DIR__) . '/bootstrap.php';

try {
    $pdo = ConnectionFactory::create();
    $menuRepository = new PdoMenuRepository($pdo);
    $orderRepository = new PdoOrderRepository($pdo);
    $controller = new ApiController(
        new ListWeeklyMenu($menuRepository),
        new CreateOrder($menuRepository, $orderRepository),
        new TrackOrder($orderRepository),
        new CreateCateringBooking(new PdoCateringBookingRepository($pdo)),
        Environment::bool('APP_DEBUG'),
    );

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = trim((string) ($_SERVER['PATH_INFO'] ?? ''), '/');
    if ($path === '') {
        $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
        $marker = '/api/index.php/';
        $path = str_contains($requestPath, $marker) ? substr($requestPath, strpos($requestPath, $marker) + strlen($marker)) : '';
    }

    match ([$method, $path]) {
        ['GET', 'menu'] => $controller->menu(),
        ['POST', 'orders'] => $controller->createOrder(),
        ['POST', 'catering'] => $controller->createCateringBooking(),
        ['GET', 'orders/track'] => $controller->trackOrder(),
        ['GET', 'health'] => JsonResponse::send(['status' => 'ok', 'database' => 'connected']),
        default => JsonResponse::send(['message' => 'Endpoint not found.'], 404),
    };
} catch (Throwable $exception) {
    if (isset($controller)) {
        $controller->handleFailure($exception);
    }
    error_log($exception->__toString());
    JsonResponse::send([
        'message' => Environment::bool('APP_DEBUG') ? $exception->getMessage() : 'The service is temporarily unavailable.',
    ], 500);
}
