<?php
/**
 * @fileoverview Requirement Validation Helper
 * 
 * Server-side validation for requirement-related DTOs
 * Performs type checking, required field validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, int, float, bool, null)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate requirement type and status against allowed values
 * - String length validation: Title (3-100), description (10-500)
 * - Numeric validation: targetValue > 0
 * - Business rule validation: Check constraints
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class RequirementValidationHelper {

    // Allowed requirement types
    public const ALLOWED_TYPES = ['attendance', 'service_hours', 'activity_points', 'payment', 'custom'];
    public const ALLOWED_MEMBER_STATUSES = ['Not Started', 'In Progress', 'Completed', 'Failed'];

    // String length constraints
    public const TITLE_MIN = 3;
    public const TITLE_MAX = 100;
    public const DESCRIPTION_MIN = 10;
    public const DESCRIPTION_MAX = 500;

    /**
     * Validate RequirementCreateDTO data
     * 
     * Validates data structure matches RequirementCreateDTO requirements:
     * - Required fields: title, description, type, targetValue, unit
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, string lengths, numeric ranges
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateRequirementCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['title', 'description', 'type', 'targetValue', 'unit'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Type validation - title
        if (!is_string($data['title']) || empty(trim($data['title']))) {
            $errors['title'] = "title must be a non-empty string";
        } else {
            $titleLength = strlen(trim($data['title']));
            if ($titleLength < self::TITLE_MIN || $titleLength > self::TITLE_MAX) {
                $errors['title'] = "title must be between " . self::TITLE_MIN . " and " . self::TITLE_MAX . " characters";
            }
        }

        // Type validation - description
        if (!is_string($data['description']) || empty(trim($data['description']))) {
            $errors['description'] = "description must be a non-empty string";
        } else {
            $descLength = strlen(trim($data['description']));
            if ($descLength < self::DESCRIPTION_MIN || $descLength > self::DESCRIPTION_MAX) {
                $errors['description'] = "description must be between " . self::DESCRIPTION_MIN . " and " . self::DESCRIPTION_MAX . " characters";
            }
        }

        // Type validation - type (enum)
        if (!is_string($data['type']) || !in_array($data['type'], self::ALLOWED_TYPES, true)) {
            $errors['type'] = "type must be one of: " . implode(', ', self::ALLOWED_TYPES);
        }

        // Type validation - targetValue
        if (!is_numeric($data['targetValue']) || (float)$data['targetValue'] <= 0) {
            $errors['targetValue'] = "targetValue must be a positive number";
        }

        // Type validation - unit
        if (!is_string($data['unit']) || empty(trim($data['unit']))) {
            $errors['unit'] = "unit must be a non-empty string";
        }

        // Optional field: isActive
        if (isset($data['isActive']) && !is_bool($data['isActive'])) {
            $errors['isActive'] = "isActive must be a boolean";
        }

        // Optional field: semesterId
        if (isset($data['semesterId']) && !is_int($data['semesterId']) && $data['semesterId'] !== null) {
            $errors['semesterId'] = "semesterId must be an integer or null";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate RequirementUpdateDTO data
     * 
     * Validates data structure matches RequirementUpdateDTO requirements:
     * - All fields optional (partial update)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateRequirementUpdateDTO(array $data): array {
        $errors = [];

        // All fields are optional, but if present, must be valid type

        // Optional field: title
        if (isset($data['title']) && $data['title'] !== null && $data['title'] !== '') {
            if (!is_string($data['title']) || empty(trim($data['title']))) {
                $errors['title'] = "title must be a non-empty string";
            } else {
                $titleLength = strlen(trim($data['title']));
                if ($titleLength < self::TITLE_MIN || $titleLength > self::TITLE_MAX) {
                    $errors['title'] = "title must be between " . self::TITLE_MIN . " and " . self::TITLE_MAX . " characters";
                }
            }
        }

        // Optional field: description
        if (isset($data['description']) && $data['description'] !== null && $data['description'] !== '') {
            if (!is_string($data['description']) || empty(trim($data['description']))) {
                $errors['description'] = "description must be a non-empty string";
            } else {
                $descLength = strlen(trim($data['description']));
                if ($descLength < self::DESCRIPTION_MIN || $descLength > self::DESCRIPTION_MAX) {
                    $errors['description'] = "description must be between " . self::DESCRIPTION_MIN . " and " . self::DESCRIPTION_MAX . " characters";
                }
            }
        }

        // Optional field: targetValue
        if (isset($data['targetValue']) && !is_numeric($data['targetValue']) || (isset($data['targetValue']) && (float)$data['targetValue'] <= 0)) {
            $errors['targetValue'] = "targetValue must be a positive number";
        }

        // Optional field: unit
        if (isset($data['unit']) && $data['unit'] !== null && $data['unit'] !== '') {
            if (!is_string($data['unit']) || empty(trim($data['unit']))) {
                $errors['unit'] = "unit must be a non-empty string";
            }
        }

        // Optional field: isActive
        if (isset($data['isActive']) && !is_bool($data['isActive'])) {
            $errors['isActive'] = "isActive must be a boolean";
        }

        // Optional field: semesterId
        if (isset($data['semesterId']) && !is_int($data['semesterId']) && $data['semesterId'] !== null) {
            $errors['semesterId'] = "semesterId must be an integer or null";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate RequirementQueryDTO data
     * 
     * @param array $data Raw query data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateRequirementQueryDTO(array $data): array {
        $errors = [];

        // Optional field: type
        if (isset($data['type']) && !in_array($data['type'], self::ALLOWED_TYPES, true)) {
            $errors['type'] = "type must be one of: " . implode(', ', self::ALLOWED_TYPES);
        }

        // Optional field: isActive
        if (isset($data['isActive']) && !is_bool($data['isActive'])) {
            $errors['isActive'] = "isActive must be a boolean";
        }

        // Optional field: semesterId
        if (isset($data['semesterId']) && !is_int($data['semesterId']) && $data['semesterId'] !== null) {
            $errors['semesterId'] = "semesterId must be an integer or null";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate MemberRequirementDTO data
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateMemberRequirementDTO(array $data): array {
        $errors = [];

        // Required fields
        $required = ['memberId', 'requirementId', 'currentValue', 'targetValue', 'status'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        // Type validation - memberId
        if (isset($data['memberId']) && (!is_int($data['memberId']) || $data['memberId'] <= 0)) {
            $errors['memberId'] = "memberId must be a positive integer";
        }

        // Type validation - requirementId
        if (isset($data['requirementId']) && (!is_int($data['requirementId']) || $data['requirementId'] <= 0)) {
            $errors['requirementId'] = "requirementId must be a positive integer";
        }

        // Type validation - currentValue
        if (isset($data['currentValue']) && !is_numeric($data['currentValue'])) {
            $errors['currentValue'] = "currentValue must be a number";
        }

        // Type validation - targetValue
        if (isset($data['targetValue']) && !is_numeric($data['targetValue'])) {
            $errors['targetValue'] = "targetValue must be a number";
        }

        // Type validation - status
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_MEMBER_STATUSES, true)) {
            $errors['status'] = "status must be one of: " . implode(', ', self::ALLOWED_MEMBER_STATUSES);
        }

        // Type validation - isMet
        if (isset($data['isMet']) && !is_bool($data['isMet'])) {
            $errors['isMet'] = "isMet must be a boolean";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate RequirementFulfillmentDTO data
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateRequirementFulfillmentDTO(array $data): array {
        $errors = [];

        // Required fields
        $required = ['memberId', 'requirementId', 'valueAdded', 'reason'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        // Type validation - memberId
        if (isset($data['memberId']) && (!is_int($data['memberId']) || $data['memberId'] <= 0)) {
            $errors['memberId'] = "memberId must be a positive integer";
        }

        // Type validation - requirementId
        if (isset($data['requirementId']) && (!is_int($data['requirementId']) || $data['requirementId'] <= 0)) {
            $errors['requirementId'] = "requirementId must be a positive integer";
        }

        // Type validation - valueAdded
        if (isset($data['valueAdded']) && !is_numeric($data['valueAdded'])) {
            $errors['valueAdded'] = "valueAdded must be a number";
        }

        // Type validation - reason
        if (isset($data['reason']) && !is_string($data['reason'])) {
            $errors['reason'] = "reason must be a string";
        }

        // Optional field: notes
        if (isset($data['notes']) && !is_string($data['notes']) && $data['notes'] !== null) {
            $errors['notes'] = "notes must be a string or null";
        }

        // Type validation - recordedBy
        if (isset($data['recordedBy']) && (!is_int($data['recordedBy']) || $data['recordedBy'] <= 0)) {
            $errors['recordedBy'] = "recordedBy must be a positive integer";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
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
