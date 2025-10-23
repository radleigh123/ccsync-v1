<?php
/**
 * Lookup User by ID Number
 *
 * Retrieves user information from the users table by their school ID number.
 * Used in the member registration flow to auto-fill user data.
 * Only returns basic user info to avoid unnecessary data exposure.
 *
 * @author CCSync Development Team
 * @version 1.0
 *
 * @endpoint GET /temp/auth/getUserByIdNumber.php?idNumber=20023045
 * @return {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "firstName": "Juan",
 *     "lastName": "Dela Cruz",
 *     "email": "juan.delacruz@example.com",
 *     "idNumber": "20023045"
 *   }
 * }
 */

require_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get ID number from query parameter
$idNumber = $_GET['idNumber'] ?? '';

if (!$idNumber) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID number is required"
    ]);
    exit;
}

try {
    // Query to find user by school ID number
    $query = "
        SELECT id, name_first, name_last, email, id_school_number
        FROM users
        WHERE id_school_number = :idNumber
        LIMIT 1
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(":idNumber", $idNumber);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    // Return user data in a structured format
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => [
            "id" => (int)$user['id'],
            "firstName" => $user['name_first'],
            "lastName" => $user['name_last'],
            "email" => $user['email'],
            "idNumber" => $user['id_school_number']
        ]
    ]);

} catch (Exception $e) {
    error_log("Error fetching user: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error"
    ]);
}
?>
