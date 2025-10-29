<?php
/**
 * @fileoverview Requirement Validation Helper
 * 
 * Server-side validation for requirement-related DTOs
 * Performs type checking, required field validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, date, enum)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate status against allowed values (open|closed|archived)
 * - Format validation: Validate date formats (YYYY-MM-DD)
 * - Business rule validation: Check constraints (name length, date validity, etc.)
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class RequirementValidationHelper {

    // Allowed status values (enums)
    public const ALLOWED_STATUS = ['open', 'closed', 'archived'];
    
    // Field length constraints
    public const NAME_MIN_LENGTH = 3;
    public const NAME_MAX_LENGTH = 255;
    public const DESCRIPTION_MAX_LENGTH = 65535; // TEXT field max

    /**
     * Validate RequirementCreateDTO data
     * 
     * Validates data structure matches RequirementCreateDTO requirements:
     * - Required fields: name, requirementDate
     * - Optional fields: description, status
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, date formats, string lengths
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateRequirementCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['name', 'requirementDate'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Name validation
        if (!is_string($data['name']) || empty(trim($data['name']))) {
            $errors['name'] = "Name must be a non-empty string";
        } else {
            $nameLength = strlen(trim($data['name']));
            if ($nameLength < self::NAME_MIN_LENGTH) {
                $errors['name'] = "Name must be at least " . self::NAME_MIN_LENGTH . " characters";
            } elseif ($nameLength > self::NAME_MAX_LENGTH) {
                $errors['name'] = "Name must not exceed " . self::NAME_MAX_LENGTH . " characters";
            }
        }

        // Requirement Date validation
        if (!is_string($data['requirementDate']) || !self::isValidDate($data['requirementDate'])) {
            $errors['requirementDate'] = "Requirement date must be in YYYY-MM-DD format";
        }

        // Optional: Description validation
        if (isset($data['description']) && $data['description'] !== null && !is_string($data['description'])) {
            $errors['description'] = "Description must be a string or null";
        }

        // Optional: Status validation (default: 'open')
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_STATUS, true)) {
            $errors['status'] = "Status must be one of: " . implode(', ', self::ALLOWED_STATUS);
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

        // All fields are optional, but if present, must be valid

        // Name validation (if provided)
        if (isset($data['name'])) {
            if (!is_string($data['name']) || empty(trim($data['name']))) {
                $errors['name'] = "Name must be a non-empty string";
            } else {
                $nameLength = strlen(trim($data['name']));
                if ($nameLength < self::NAME_MIN_LENGTH) {
                    $errors['name'] = "Name must be at least " . self::NAME_MIN_LENGTH . " characters";
                } elseif ($nameLength > self::NAME_MAX_LENGTH) {
                    $errors['name'] = "Name must not exceed " . self::NAME_MAX_LENGTH . " characters";
                }
            }
        }

        // Requirement Date validation (if provided)
        if (isset($data['requirementDate']) && !self::isValidDate($data['requirementDate'])) {
            $errors['requirementDate'] = "Requirement date must be in YYYY-MM-DD format";
        }

        // Description validation (if provided)
        if (isset($data['description']) && !is_string($data['description']) && $data['description'] !== null) {
            $errors['description'] = "Description must be a string or null";
        }

        // Status validation (if provided)
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_STATUS, true)) {
            $errors['status'] = "Status must be one of: " . implode(', ', self::ALLOWED_STATUS);
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
     * @return bool True if valid date in YYYY-MM-DD format, false otherwise
     */
    private static function isValidDate(string $date): bool {
        // Check format: YYYY-MM-DD
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return false;
        }

        // Check if it's a valid calendar date
        $dateObj = \DateTime::createFromFormat('Y-m-d', $date);
        return $dateObj && $dateObj->format('Y-m-d') === $date;
    }

    /**
     * Create standardized error response
     * 
     * @param int $statusCode HTTP status code
     * @param string $message Human-readable error message
     * @param array $errors Field-level errors (optional)
     * @return array Error response array
     */
    public static function createErrorResponse(int $statusCode, string $message, array $errors = []): array {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return $response;
    }

    /**
     * Create standardized success response
     * 
     * @param string $message Human-readable success message
     * @param array $data Response data (optional)
     * @return array Success response array
     */
    public static function createSuccessResponse(string $message, array $data = []): array {
        $response = [
            'success' => true,
            'message' => $message
        ];

        if (!empty($data)) {
            $response['data'] = $data;
        }

        return $response;
    }
}
