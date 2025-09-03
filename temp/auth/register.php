<?php

require_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5137"); // for dev, allow requests from Vite
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$fName = $data['firstName'] ?? "";
$lName = $data['lastName'] ?? "";
$idNumber = $data['idNumber'] ?? "";
$email = $data['email'] ?? "";
// FIXME: Needs encryption, maybe BycryptJS
$password = $data['password'] ?? "";

if (!$fName || !$lName || !$email || !$idNumber || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $query = "
        INSERT INTO users (name_first, name_last, email, id_school_number, password)
        VALUES (:fName, :lName, :email, :idNumber, :password);
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":fName", $fName);
    $stmt->bindParam(":lName", $lName);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":idNumber", $idNumber);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->execute();

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully"
    ]);
} catch (PDOException $e) {

    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server Error"
    ]);
}

$conn = null;
