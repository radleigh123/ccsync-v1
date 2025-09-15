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

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Validate required fields
    if (!isset($data['name_first']) || !isset($data['name_last']) || !isset($data['email']) || !isset($data['school_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Required fields missing']);
        exit;
    }
    
    try {
        // Prepare SQL statement to prevent SQL injection (using PDO)
        $query = "INSERT INTO users (name_first, name_last, id_school_number, email) VALUES (:name_first, :name_last, :id_school_number, :email)";
        $stmt = $conn->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':name_first', $data['name_first']);
        $stmt->bindParam(':name_last', $data['name_last']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':id_school_number', $data['school_id']);
        
        // Execute the statement
        if ($stmt->execute()) {
            $user_id = $conn->lastInsertId();
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'User added successfully', 'user_id' => $user_id]);
        } else {
            throw new Exception("Error executing query");
        }
        
    } catch (Exception $e) {
        error_log("Add User Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST']);
}

$conn = null;
?>