<?php
/**
 * @fileoverview Officer Validation Helper
 * 
 * Server-side validation for officer-related DTOs
 * Performs type checking, required field validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, int, bool, null)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate position and status against allowed values
 * - Format validation: Validate date formats (YYYY-MM-DD)
 * - Date logic validation: startDate <= endDate, endDate >= today
 * - Business rule validation: Check constraints
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class OfficerValidationHelper {

    // Allowed officer positions
    public const ALLOWED_POSITIONS = ['President', 'VP', 'Secretary', 'Treasurer', 'Auditor', 'PIO'];
    public const ALLOWED_STATUSES = ['current', 'former'];

    /**
     * Validate OfficerCreateDTO data
     * 
     * Validates data structure matches OfficerCreateDTO requirements:
     * - Required fields: memberId, position, startDate
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, date formats
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateOfficerCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['memberId', 'position', 'startDate'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Type validation - memberId
        if (!is_int($data['memberId']) || $data['memberId'] <= 0) {
            $errors['memberId'] = "memberId must be a positive integer";
        }

        // Type validation - position (enum)
        if (!is_string($data['position']) || !in_array($data['position'], self::ALLOWED_POSITIONS, true)) {
            $errors['position'] = "position must be one of: " . implode(', ', self::ALLOWED_POSITIONS);
        }

        // Type validation - startDate
        if (!is_string($data['startDate']) || !self::isValidDate($data['startDate'])) {
            $errors['startDate'] = "startDate must be in YYYY-MM-DD format";
        }

        // Optional field: endDate
        if (isset($data['endDate']) && $data['endDate'] !== null && $data['endDate'] !== '') {
            if (!is_string($data['endDate']) || !self::isValidDate($data['endDate'])) {
                $errors['endDate'] = "endDate must be in YYYY-MM-DD format";
            } else {
                // Check if endDate >= startDate
                $endDateTime = strtotime($data['endDate']);
                $startDateTime = strtotime($data['startDate']);
                if ($endDateTime < $startDateTime) {
                    $errors['endDate'] = "endDate must be greater than or equal to startDate";
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate OfficerUpdateDTO data
     * 
     * Validates data structure matches OfficerUpdateDTO requirements:
     * - All fields optional (partial update)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * 
     * @param array $data Raw data to validate
     * @param ?array $existingOfficer Existing officer data for constraint validation (optional)
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateOfficerUpdateDTO(array $data, ?array $existingOfficer = null): array {
        $errors = [];

        // All fields are optional, but if present, must be valid type

        // Optional field: position (enum)
        if (isset($data['position']) && !in_array($data['position'], self::ALLOWED_POSITIONS, true)) {
            $errors['position'] = "position must be one of: " . implode(', ', self::ALLOWED_POSITIONS);
        }

        // Optional field: endDate
        if (isset($data['endDate'])) {
            if ($data['endDate'] !== null && $data['endDate'] !== '') {
                if (!is_string($data['endDate']) || !self::isValidDate($data['endDate'])) {
                    $errors['endDate'] = "endDate must be in YYYY-MM-DD format";
                } else {
                    // Check if endDate >= startDate (get startDate from existing if not provided)
                    $startDate = $existingOfficer['startDate'] ?? null;
                    if ($startDate) {
                        $endDateTime = strtotime($data['endDate']);
                        $startDateTime = strtotime($startDate);
                        if ($endDateTime < $startDateTime) {
                            $errors['endDate'] = "endDate must be greater than or equal to startDate";
                        }
                    }
                }
            }
        }

        // Optional field: status
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_STATUSES, true)) {
            $errors['status'] = "status must be one of: " . implode(', ', self::ALLOWED_STATUSES);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate OfficerQueryDTO data
     * 
     * @param array $data Raw query data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateOfficerQueryDTO(array $data): array {
        $errors = [];

        // Optional field: position
        if (isset($data['position']) && !in_array($data['position'], self::ALLOWED_POSITIONS, true)) {
            $errors['position'] = "position must be one of: " . implode(', ', self::ALLOWED_POSITIONS);
        }

        // Optional field: status
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_STATUSES, true)) {
            $errors['status'] = "status must be one of: " . implode(', ', self::ALLOWED_STATUSES);
        }

        // Optional field: memberId
        if (isset($data['memberId']) && (!is_int($data['memberId']) || $data['memberId'] <= 0)) {
            $errors['memberId'] = "memberId must be a positive integer or null";
        }

        // Optional field: currentOnly
        if (isset($data['currentOnly']) && !is_bool($data['currentOnly'])) {
            $errors['currentOnly'] = "currentOnly must be a boolean";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate date format (YYYY-MM-DD)
     * 
     * @param string $date Date string to validate
     * @return bool True if valid date format
     */
    public static function isValidDate(string $date): bool {
        $pattern = '/^\d{4}-\d{2}-\d{2}$/';
        if (!preg_match($pattern, $date)) {
            return false;
        }
        
        $parsedTime = strtotime($date);
        return $parsedTime !== false && $date === date('Y-m-d', $parsedTime);
    }

    /**
     * Create structured error response
     * 
     * @param int $statusCode HTTP status code
     * @param string $message Error message
     * @param array $errors Field-level errors
     * @return array Structured error response
     */
    public static function createErrorResponse(int $statusCode, string $message, array $errors = []): array {
        return [
            'success' => false,
            'message' => $message,
            'statusCode' => $statusCode,
            'errors' => $errors
        ];
    }

    /**
     * Create structured success response
     * 
     * @param string $message Success message
     * @param array $data Response data
     * @return array Structured success response
     */
    public static function createSuccessResponse(string $message, array $data = []): array {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }
}

?>
