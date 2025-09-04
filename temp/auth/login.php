<?php

require_once __DIR__ . '/../config/database.php';

$allowedOrigins = [
    "http://localhost:5137",
    "https://radleigh123.github.io"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$idNumber = $data["idNumber"] ?? "";
$password = $data["password"] ?? "";

try {
    $query = "SELECT * FROM users WHERE id_school_number = :idNumber";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":idNumber", $idNumber);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid credentials"
        ]);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid credentials"
        ]);
        exit;
    }

    unset($user['password']);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Login Successful",
        "user" => $user
    ]);
} catch (PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    file_put_contents("debug.log", date('Y-m-d H:i:s') . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Login Error"
    ]);
}

$conn = null;
