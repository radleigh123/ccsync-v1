<?php
/**
 * Create Member
 *
 * Registers a user as a member of the organization.
 * Links a user (from users table) to a member record with additional details.
 * The user must already exist in the users table.
 *
 * @author CCSync Development Team
 * @version 1.0
 *
 * @endpoint POST /temp/members/createMember.php
 * @body {
 *   "userId": 1,
 *   "idNumber": "20023045",
 *   "birthDate": "2003-05-15",
 *   "program": "BSIT",
 *   "yearLevel": 3,
 *   "isPaid": true,
 *   "enrollmentDate": "2025-08-20"
 * }
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/MemberValidationHelper.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate against MemberCreateDTO schema
$validation = MemberValidationHelper::validateMemberCreateDTO($data);

if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode(MemberValidationHelper::createErrorResponse(
        400,
        "Validation failed",
        $validation['errors']
    ));
    exit;
}

try {
    // First, fetch user details to populate member fields
    $userQuery = "
        SELECT id, name_first, name_last, email
        FROM users
        WHERE id_school_number = :idNumber
        LIMIT 1
    ";

    $userStmt = $conn->prepare($userQuery);
    $userStmt->bindParam(":idNumber", $data['idNumber']);
    $userStmt->execute();

    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    // Check if member already exists
    $checkQuery = "
        SELECT id FROM members
        WHERE id_school_number = :idNumber
        LIMIT 1
    ";

    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bindParam(":idNumber", $data['idNumber']);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Member already exists for this ID number"
        ]);
        exit;
    }

    // Insert member record
    $enrollmentDate = $data['enrollmentDate'] ?? date('Y-m-d');
    $isPaid = (int)($data['isPaid'] ?? false);

    $query = "
        INSERT INTO members (
            first_name,
            last_name,
            suffix,
            id_school_number,
            email,
            birth_date,
            enrollment_date,
            program,
            year,
            is_paid,
            created_at,
            updated_at
        ) VALUES (
            :firstName,
            :lastName,
            :suffix,
            :idNumber,
            :email,
            :birthDate,
            :enrollmentDate,
            :program,
            :yearLevel,
            :isPaid,
            NOW(),
            NOW()
        )
    ";

    $stmt = $conn->prepare($query);
    $suffix = $data['suffix'] ?? null;
    $stmt->bindParam(":firstName", $user['name_first']);
    $stmt->bindParam(":lastName", $user['name_last']);
    $stmt->bindParam(":suffix", $suffix);
    $stmt->bindParam(":idNumber", $data['idNumber']);
    $stmt->bindParam(":email", $user['email']);
    $stmt->bindParam(":birthDate", $data['birthDate']);
    $stmt->bindParam(":enrollmentDate", $enrollmentDate);
    $stmt->bindParam(":program", $data['program']);
    $stmt->bindParam(":yearLevel", $data['yearLevel']);
    $stmt->bindParam(":isPaid", $isPaid);

    $stmt->execute();

    $memberId = $conn->lastInsertId();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Member registered successfully",
        "data" => [
            "id" => (int)$memberId,
            "idNumber" => $data['idNumber']
        ]
    ]);

} catch (Exception $e) {
    error_log("Error creating member: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>
