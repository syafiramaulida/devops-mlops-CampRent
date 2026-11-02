<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['error' => 'Metode request tidak diizinkan.']);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $database = getDatabaseConnection();
    $statement = $database->query(
        "SELECT id, name, price, capacity, description, image, status, billing_unit
         FROM packages
         WHERE status = 'active'
         ORDER BY id ASC"
    );

    $packages = array_map(
        static function (array $package): array {
            return [
                'id' => (int) $package['id'],
                'name' => $package['name'],
                'price' => (int) $package['price'],
                'capacity' => (int) $package['capacity'],
                'description' => $package['description'],
                'image' => $package['image'],
                'status' => $package['status'],
                'billingUnit' => $package['billing_unit'],
            ];
        },
        $statement->fetchAll()
    );

    echo json_encode($packages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log('CampRent package API error: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Data paket gagal diambil dari database.']);
}
