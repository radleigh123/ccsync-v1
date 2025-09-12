<?php
// Database connection
require_once('../config/database.php');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check for proper request method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Validate required fields
    if (!isset($data['user_id']) || !isset($data['name_first']) || !isset($data['name_last']) || !isset($data['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Required fields missing']);
        exit;
    }
    
    try {
        // Prepare SQL statement to prevent SQL injection (using PDO)
        $query = "UPDATE users SET name_first = :name_first, name_last = :name_last, id_school_number = :id_school_number, email = :email WHERE id = :user_id";
        $stmt = $conn->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':name_first', $data['name_first']);
        $stmt->bindParam(':name_last', $data['name_last']);
        $stmt->bindParam(':id_school_number', $data['school_id']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
        
        // Execute the statement
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'User updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found or no changes made']);
            }
        } else {
            throw new Exception("Error executing query");
        }
        
    } catch (Exception $e) {
        error_log("Edit User Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST']);
}

$conn = null;
?>