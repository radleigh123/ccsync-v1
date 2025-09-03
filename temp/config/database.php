<?php

$server = "127.0.0.1";
$username = "root";
$password = "";
$database = "ccsync01";

try {
    $conn = new PDO("mysql:host=$server;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    error_log("Database connection established");
    file_put_contents("debug.log", date('Y-m-d H:i:s') . " - Connection OK\n", FILE_APPEND);
} catch(PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
    file_put_contents("debug.log", date('Y-m-d H:i:s'). " - Connection failed: " . $e->getMessage() . "\n", FILE_APPEND);

    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}
