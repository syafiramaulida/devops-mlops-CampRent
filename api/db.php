<?php

declare(strict_types=1);

function getDatabaseConnection(): PDO
{
    $host = getenv('CAMPRENT_DB_HOST') ?: '127.0.0.1';
    $database = getenv('CAMPRENT_DB_NAME') ?: 'camprent';
    $username = getenv('CAMPRENT_DB_USER') ?: 'root';
    $password = getenv('CAMPRENT_DB_PASSWORD') ?: '';

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $host,
        $database
    );

    return new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
