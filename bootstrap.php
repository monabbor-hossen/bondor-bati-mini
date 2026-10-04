<?php

declare(strict_types=1);

use App\Infrastructure\Config\Environment;

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $path = __DIR__ . '/src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

Environment::load(__DIR__ . '/.env');

date_default_timezone_set(Environment::get('APP_TIMEZONE', 'Asia/Dhaka'));

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('bondor_bati_session');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}

// ── Global view helpers ────────────────────────────────────────────────────────
// Defined here so they are available in all views regardless of load order.
if (!function_exists('e')) {
    function e(mixed $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('csrfToken')) {
    function csrfToken(): string
    {
        $key = isset($_SESSION['admin_csrf']) ? 'admin_csrf' : 'csrf_token';
        $_SESSION[$key] ??= bin2hex(random_bytes(32));
        return $_SESSION[$key];
    }
}
