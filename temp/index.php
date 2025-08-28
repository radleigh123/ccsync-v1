<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5137"); // for dev, allow requests from Vite
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// TODO: temp
$users = [
    ["id" => 1, "firstName" => "John", "lastName" => "Doe", "email" => "johndoe@email.com", "idNumber" => "20200937", "password" => "1234"],
    ["id" => 2, "firstName" => "Mary", "lastName" => "Sae", "email" => "marysae@email.com", "idNumber" => "12345678", "password" => "1234"],
];

$data = json_decode(file_get_contents("php://input"), true);

$idNumber = isset($data["idNumber"]) ? $data["idNumber"] : "";
$password = isset($data["password"]) ? $data["password"] : "";

foreach ($users as $user) {
    if ($user["idNumber"] === $idNumber && $user["password"] === $password) {
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user["id"],
                "firstName" => $user["firstName"],
                "lastName" => $user["lastName"],
                "email" => $user["email"],
                "idNumber" => $user["idNumber"]
            ]
        ]);
        exit;
    }
}

// Invalid login
http_response_code(401);
echo json_encode(["success" => false, "message" => "Invalid credentials"]);
