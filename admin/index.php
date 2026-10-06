<?php
declare(strict_types=1);

/**
 * Admin Panel Entry Point
 *
 * This file is intentionally thin — it bootstraps the autoloader and
 * hands off all logic to AdminController, which follows MVC architecture.
 */

// Session must be configured BEFORE bootstrap calls session_start()
if (session_status() === PHP_SESSION_NONE) {
    session_name('bondor_bati_admin');
    session_set_cookie_params([
        'httponly' => true,
        'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'samesite' => 'Lax',
        'path'     => '/',
    ]);
    session_start(); // Start HERE so bootstrap.php skips it
}

require dirname(__DIR__) . '/bootstrap.php';

(new \App\Controllers\AdminController())->handleRequest();
