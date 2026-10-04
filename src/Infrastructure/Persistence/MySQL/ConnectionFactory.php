<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\MySQL;

use App\Infrastructure\Config\Environment;
use PDO;

final class ConnectionFactory
{
    private static ?PDO $connection = null;

    public static function create(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            Environment::get('DB_HOST', '127.0.0.1'),
            Environment::get('DB_PORT', '3306'),
            Environment::get('DB_DATABASE', 'bondor_bati'),
        );

        self::$connection = new PDO(
            $dsn,
            Environment::get('DB_USERNAME', 'bondor_bati'),
            Environment::get('DB_PASSWORD'),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ],
        );

        return self::$connection;
    }
}

