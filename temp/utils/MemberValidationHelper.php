<?php
/**
 * @fileoverview Member Validation Helper
 * 
 * Server-side validation for member-related DTOs
 * Performs type checking, required field validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, int, bool)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate program and yearLevel against allowed values
 * - Format validation: Validate date formats (YYYY-MM-DD)
 * - Business rule validation: Check constraints (yearLevel 1-4, etc.)
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class MemberValidationHelper {

    // Allowed values (enums)
    public const ALLOWED_PROGRAMS = ['BSIT', 'BSCS', 'BSIS'];
    public const ALLOWED_YEAR_LEVELS = [1, 2, 3, 4];

    /**
     * Validate MemberCreateDTO data
     * 
     * Validates data structure matches MemberCreateDTO requirements:
     * - Required fields: userId, idNumber, firstName, lastName, email, birthDate, program, yearLevel
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, date formats, numeric ranges
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateMemberCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['userId', 'idNumber', 'firstName', 'lastName', 'email', 'birthDate', 'program', 'yearLevel'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Type validation
        if (!is_int($data['userId']) || $data['userId'] <= 0) {
            $errors['userId'] = "userId must be a positive integer";
        }

        if (!is_string($data['idNumber']) || empty(trim($data['idNumber']))) {
            $errors['idNumber'] = "idNumber must be a non-empty string";
        }

        if (!is_string($data['firstName']) || empty(trim($data['firstName']))) {
            $errors['firstName'] = "firstName must be a non-empty string";
        }

        if (!is_string($data['lastName']) || empty(trim($data['lastName']))) {
            $errors['lastName'] = "lastName must be a non-empty string";
        }

        if (!is_string($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = "email must be a valid email address";
        }

        if (!is_string($data['birthDate']) || !self::isValidDate($data['birthDate'])) {
            $errors['birthDate'] = "birthDate must be in YYYY-MM-DD format";
        }

        if (!is_string($data['program']) || !in_array($data['program'], self::ALLOWED_PROGRAMS, true)) {
            $errors['program'] = "program must be one of: " . implode(', ', self::ALLOWED_PROGRAMS);
        }

        if (!is_int($data['yearLevel']) || !in_array($data['yearLevel'], self::ALLOWED_YEAR_LEVELS, true)) {
            $errors['yearLevel'] = "yearLevel must be one of: " . implode(', ', self::ALLOWED_YEAR_LEVELS);
        }

        // Optional fields validation
        if (isset($data['suffix']) && !is_string($data['suffix']) && $data['suffix'] !== null) {
            $errors['suffix'] = "suffix must be a string or null";
        }

        if (isset($data['isPaid']) && !is_bool($data['isPaid'])) {
            $errors['isPaid'] = "isPaid must be a boolean";
        }

        if (isset($data['enrollmentDate']) && $data['enrollmentDate'] !== null && !self::isValidDate($data['enrollmentDate'])) {
            $errors['enrollmentDate'] = "enrollmentDate must be in YYYY-MM-DD format";
        }

        if (isset($data['semesterId']) && !is_int($data['semesterId']) && $data['semesterId'] !== null) {
            $errors['semesterId'] = "semesterId must be an integer or null";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate MemberUpdateDTO data
     * 
     * Validates data structure matches MemberUpdateDTO requirements:
     * - All fields optional (partial update)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateMemberUpdateDTO(array $data): array {
        $errors = [];

        // All fields are optional, but if present, must be valid type

        if (isset($data['suffix']) && !is_string($data['suffix']) && $data['suffix'] !== null) {
            $errors['suffix'] = "suffix must be a string or null";
        }

        if (isset($data['birthDate']) && !self::isValidDate($data['birthDate'])) {
            $errors['birthDate'] = "birthDate must be in YYYY-MM-DD format";
        }

        if (isset($data['program']) && !in_array($data['program'], self::ALLOWED_PROGRAMS, true)) {
            $errors['program'] = "program must be one of: " . implode(', ', self::ALLOWED_PROGRAMS);
        }

        if (isset($data['yearLevel']) && !in_array($data['yearLevel'], self::ALLOWED_YEAR_LEVELS, true)) {
            $errors['yearLevel'] = "yearLevel must be one of: " . implode(', ', self::ALLOWED_YEAR_LEVELS);
        }

        if (isset($data['isPaid']) && !is_bool($data['isPaid'])) {
            $errors['isPaid'] = "isPaid must be a boolean";
        }

        if (isset($data['semesterId']) && !is_int($data['semesterId']) && $data['semesterId'] !== null) {
            $errors['semesterId'] = "semesterId must be an integer or null";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate MemberQueryDTO data
     * 
     * Validates data structure matches MemberQueryDTO requirements:
     * - All fields optional (search only by present fields)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateMemberQueryDTO(array $data): array {
        $errors = [];

        if (isset($data['idNumber']) && !is_string($data['idNumber'])) {
            $errors['idNumber'] = "idNumber must be a string";
        }

        if (isset($data['program']) && !in_array($data['program'], self::ALLOWED_PROGRAMS, true)) {
            $errors['program'] = "program must be one of: " . implode(', ', self::ALLOWED_PROGRAMS);
        }

        if (isset($data['yearLevel']) && !in_array($data['yearLevel'], self::ALLOWED_YEAR_LEVELS, true)) {
            $errors['yearLevel'] = "yearLevel must be one of: " . implode(', ', self::ALLOWED_YEAR_LEVELS);
        }

        if (isset($data['isPaid']) && !is_bool($data['isPaid'])) {
            $errors['isPaid'] = "isPaid must be a boolean";
        }

        if (isset($data['semesterId']) && !is_int($data['semesterId'])) {
            $errors['semesterId'] = "semesterId must be an integer";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate date format (YYYY-MM-DD)
     * 
     * Checks if date string is in correct format and represents a valid date
     * 
     * @param string $date Date string to validate
     * @return bool True if valid YYYY-MM-DD format and valid date
     */
    private static function isValidDate(string $date): bool {
        // Check format: YYYY-MM-DD
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return false;
        }

        // Check if date is valid (e.g., not 2023-02-30)
        $parts = explode('-', $date);
        if (count($parts) !== 3) {
            return false;
        }

        $year = (int)$parts[0];
        $month = (int)$parts[1];
        $day = (int)$parts[2];

        return checkdate($month, $day, $year);
    }

    /**
     * Validate idNumber format and length
     * 
     * School ID should be numeric and reasonable length
     * 
     * @param string $idNumber ID number to validate
     * @return bool True if valid format
     */
    public static function isValidIdNumber(string $idNumber): bool {
        // Should be numeric, 5-20 characters
        return preg_match('/^\d{5,20}$/', $idNumber) === 1;
    }

    /**
     * Create error response array
     * 
     * Standardized error response format for API endpoints
     * 
     * @param int $httpCode HTTP status code
     * @param string $message Error message
     * @param array $errors Detailed error array
     * @return array Response array
     */
    public static function createErrorResponse(int $httpCode, string $message, array $errors = []): array {
        return [
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'httpCode' => $httpCode
        ];
    }

    /**
     * Create success response array
     * 
     * Standardized success response format for API endpoints
     * 
     * @param mixed $data Response data (optional)
     * @param string $message Success message (optional)
     * @return array Response array
     */
    public static function createSuccessResponse($data = null, string $message = ''): array {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }
}
?>
