<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5137"); // for dev, allow requests from Vite
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$server = "127.0.0.1";
$username = "root";
$password = "";
$database = "ccsync01";

try {
    $conn = new mysqli($server, $username, $password, $database);
    

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database connection error"
        ]);
        exit;
    }

    $query = "SELECT * FROM users";
    $result = $conn->query($query);

    $users = [];
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    header('Content-Type: application/json');

    http_response_code(200);
    echo json_encode($users);
} catch (PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    file_put_contents("debug.log", date('Y-m-d H:i:s') . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Users list error"
    ]);
}

$conn = null;
