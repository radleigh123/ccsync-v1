<?php
/**
 * @fileoverview User Validation Helper
 * 
 * Server-side validation for user-related DTOs
 * Performs type checking, required field validation, password strength validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, int, bool, null)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate role against allowed values (student, officer, admin)
 * - Format validation: Email format validation, password strength
 * - String length validation: Names (2-50), email standard limits
 * - Password validation: Min 8 chars, must include uppercase, lowercase, number, special char
 * - Uniqueness validation: idNumber and email must be unique (requires DB check)
 * - Business rule validation: Check constraints
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class UserValidationHelper {

    // Allowed user roles
    public const ALLOWED_ROLES = ['student', 'officer', 'admin'];

    // String length constraints
    public const ID_NUMBER_MIN = 5;
    public const ID_NUMBER_MAX = 20;
    public const FIRST_NAME_MIN = 2;
    public const FIRST_NAME_MAX = 50;
    public const LAST_NAME_MIN = 2;
    public const LAST_NAME_MAX = 50;
    public const SUFFIX_MAX = 20;
    public const PASSWORD_MIN = 8;
    public const PASSWORD_MAX = 255;

    /**
     * Validate UserRegisterDTO data (public self-registration)
     * 
     * Validates data structure matches UserRegisterDTO requirements:
     * - Required fields: idNumber, firstName, lastName, email, password, passwordConfirm
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, string lengths, password strength, email format
     * - Note: Does NOT check uniqueness (requires separate DB query)
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateUserRegisterDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['idNumber', 'firstName', 'lastName', 'email', 'password', 'passwordConfirm'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Type validation - idNumber
        if (!is_string($data['idNumber']) || empty(trim($data['idNumber']))) {
            $errors['idNumber'] = "idNumber must be a non-empty string";
        } else {
            $idLength = strlen(trim($data['idNumber']));
            if ($idLength < self::ID_NUMBER_MIN || $idLength > self::ID_NUMBER_MAX) {
                $errors['idNumber'] = "idNumber must be between " . self::ID_NUMBER_MIN . " and " . self::ID_NUMBER_MAX . " characters";
            }
        }

        // Type validation - firstName
        if (!is_string($data['firstName']) || empty(trim($data['firstName']))) {
            $errors['firstName'] = "firstName must be a non-empty string";
        } else {
            $nameLength = strlen(trim($data['firstName']));
            if ($nameLength < self::FIRST_NAME_MIN || $nameLength > self::FIRST_NAME_MAX) {
                $errors['firstName'] = "firstName must be between " . self::FIRST_NAME_MIN . " and " . self::FIRST_NAME_MAX . " characters";
            }
        }

        // Type validation - lastName
        if (!is_string($data['lastName']) || empty(trim($data['lastName']))) {
            $errors['lastName'] = "lastName must be a non-empty string";
        } else {
            $nameLength = strlen(trim($data['lastName']));
            if ($nameLength < self::LAST_NAME_MIN || $nameLength > self::LAST_NAME_MAX) {
                $errors['lastName'] = "lastName must be between " . self::LAST_NAME_MIN . " and " . self::LAST_NAME_MAX . " characters";
            }
        }

        // Type validation - email
        if (!is_string($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = "email must be a valid email address";
        }

        // Type validation - password
        if (!is_string($data['password']) || strlen($data['password']) < self::PASSWORD_MIN) {
            $errors['password'] = "password must be at least " . self::PASSWORD_MIN . " characters";
        } else {
            $passwordStrength = self::validatePasswordStrength($data['password']);
            if (!$passwordStrength['valid']) {
                $errors['password'] = $passwordStrength['message'];
            }
        }

        // Type validation - passwordConfirm
        if (!is_string($data['passwordConfirm']) || empty($data['passwordConfirm'])) {
            $errors['passwordConfirm'] = "passwordConfirm is required";
        } else if ($data['password'] !== $data['passwordConfirm']) {
            $errors['passwordConfirm'] = "Passwords do not match";
        }

        // Optional field: suffix
        if (isset($data['suffix']) && !is_string($data['suffix']) && $data['suffix'] !== null) {
            $errors['suffix'] = "suffix must be a string or null";
        } else if (isset($data['suffix']) && is_string($data['suffix']) && strlen($data['suffix']) > self::SUFFIX_MAX) {
            $errors['suffix'] = "suffix must not exceed " . self::SUFFIX_MAX . " characters";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate UserCreateDTO data (admin user creation)
     * 
     * Validates data structure matches UserCreateDTO requirements:
     * - Required fields: idNumber, firstName, lastName, email
     * - Optional fields: suffix, password, role
     * - If password not provided, admin must send password reset link
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateUserCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['idNumber', 'firstName', 'lastName', 'email'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        if (!empty($errors)) {
            return ['valid' => false, 'errors' => $errors];
        }

        // Type validation - idNumber
        if (!is_string($data['idNumber']) || empty(trim($data['idNumber']))) {
            $errors['idNumber'] = "idNumber must be a non-empty string";
        } else {
            $idLength = strlen(trim($data['idNumber']));
            if ($idLength < self::ID_NUMBER_MIN || $idLength > self::ID_NUMBER_MAX) {
                $errors['idNumber'] = "idNumber must be between " . self::ID_NUMBER_MIN . " and " . self::ID_NUMBER_MAX . " characters";
            }
        }

        // Type validation - firstName
        if (!is_string($data['firstName']) || empty(trim($data['firstName']))) {
            $errors['firstName'] = "firstName must be a non-empty string";
        } else {
            $nameLength = strlen(trim($data['firstName']));
            if ($nameLength < self::FIRST_NAME_MIN || $nameLength > self::FIRST_NAME_MAX) {
                $errors['firstName'] = "firstName must be between " . self::FIRST_NAME_MIN . " and " . self::FIRST_NAME_MAX . " characters";
            }
        }

        // Type validation - lastName
        if (!is_string($data['lastName']) || empty(trim($data['lastName']))) {
            $errors['lastName'] = "lastName must be a non-empty string";
        } else {
            $nameLength = strlen(trim($data['lastName']));
            if ($nameLength < self::LAST_NAME_MIN || $nameLength > self::LAST_NAME_MAX) {
                $errors['lastName'] = "lastName must be between " . self::LAST_NAME_MIN . " and " . self::LAST_NAME_MAX . " characters";
            }
        }

        // Type validation - email
        if (!is_string($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = "email must be a valid email address";
        }

        // Optional field: suffix
        if (isset($data['suffix']) && !is_string($data['suffix']) && $data['suffix'] !== null) {
            $errors['suffix'] = "suffix must be a string or null";
        } else if (isset($data['suffix']) && is_string($data['suffix']) && strlen($data['suffix']) > self::SUFFIX_MAX) {
            $errors['suffix'] = "suffix must not exceed " . self::SUFFIX_MAX . " characters";
        }

        // Optional field: password (if provided, must be strong)
        if (isset($data['password']) && $data['password'] !== null && $data['password'] !== '') {
            if (!is_string($data['password']) || strlen($data['password']) < self::PASSWORD_MIN) {
                $errors['password'] = "password must be at least " . self::PASSWORD_MIN . " characters";
            } else {
                $passwordStrength = self::validatePasswordStrength($data['password']);
                if (!$passwordStrength['valid']) {
                    $errors['password'] = $passwordStrength['message'];
                }
            }
        }

        // Optional field: role
        if (isset($data['role']) && !in_array($data['role'], self::ALLOWED_ROLES, true)) {
            $errors['role'] = "role must be one of: " . implode(', ', self::ALLOWED_ROLES);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate UserUpdateDTO data
     * 
     * Validates data structure matches UserUpdateDTO requirements:
     * - All fields optional (partial update)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateUserUpdateDTO(array $data): array {
        $errors = [];

        // All fields are optional, but if present, must be valid type

        // Optional field: firstName
        if (isset($data['firstName']) && $data['firstName'] !== null && $data['firstName'] !== '') {
            if (!is_string($data['firstName']) || empty(trim($data['firstName']))) {
                $errors['firstName'] = "firstName must be a non-empty string";
            } else {
                $nameLength = strlen(trim($data['firstName']));
                if ($nameLength < self::FIRST_NAME_MIN || $nameLength > self::FIRST_NAME_MAX) {
                    $errors['firstName'] = "firstName must be between " . self::FIRST_NAME_MIN . " and " . self::FIRST_NAME_MAX . " characters";
                }
            }
        }

        // Optional field: lastName
        if (isset($data['lastName']) && $data['lastName'] !== null && $data['lastName'] !== '') {
            if (!is_string($data['lastName']) || empty(trim($data['lastName']))) {
                $errors['lastName'] = "lastName must be a non-empty string";
            } else {
                $nameLength = strlen(trim($data['lastName']));
                if ($nameLength < self::LAST_NAME_MIN || $nameLength > self::LAST_NAME_MAX) {
                    $errors['lastName'] = "lastName must be between " . self::LAST_NAME_MIN . " and " . self::LAST_NAME_MAX . " characters";
                }
            }
        }

        // Optional field: suffix
        if (isset($data['suffix']) && !is_string($data['suffix']) && $data['suffix'] !== null) {
            $errors['suffix'] = "suffix must be a string or null";
        } else if (isset($data['suffix']) && is_string($data['suffix']) && strlen($data['suffix']) > self::SUFFIX_MAX) {
            $errors['suffix'] = "suffix must not exceed " . self::SUFFIX_MAX . " characters";
        }

        // Optional field: email
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = "email must be a valid email address";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate UserPasswordDTO data (password change)
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateUserPasswordDTO(array $data): array {
        $errors = [];

        // Required fields
        $required = ['currentPassword', 'newPassword', 'newPasswordConfirm'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        // Type validation - newPassword
        if (isset($data['newPassword']) && strlen($data['newPassword']) < self::PASSWORD_MIN) {
            $errors['newPassword'] = "newPassword must be at least " . self::PASSWORD_MIN . " characters";
        } else if (isset($data['newPassword'])) {
            $passwordStrength = self::validatePasswordStrength($data['newPassword']);
            if (!$passwordStrength['valid']) {
                $errors['newPassword'] = $passwordStrength['message'];
            }
        }

        // Type validation - newPasswordConfirm
        if (isset($data['newPasswordConfirm']) && (!isset($data['newPassword']) || $data['newPassword'] !== $data['newPasswordConfirm'])) {
            $errors['newPasswordConfirm'] = "New passwords do not match";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate UserQueryDTO data
     * 
     * @param array $data Raw query data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateUserQueryDTO(array $data): array {
        $errors = [];

        // Optional field: idNumber
        if (isset($data['idNumber']) && !is_string($data['idNumber']) && $data['idNumber'] !== null) {
            $errors['idNumber'] = "idNumber must be a string or null";
        }

        // Optional field: firstName
        if (isset($data['firstName']) && !is_string($data['firstName']) && $data['firstName'] !== null) {
            $errors['firstName'] = "firstName must be a string or null";
        }

        // Optional field: lastName
        if (isset($data['lastName']) && !is_string($data['lastName']) && $data['lastName'] !== null) {
            $errors['lastName'] = "lastName must be a string or null";
        }

        // Optional field: email
        if (isset($data['email']) && !is_string($data['email']) && $data['email'] !== null) {
            $errors['email'] = "email must be a string or null";
        }

        // Optional field: role
        if (isset($data['role']) && !in_array($data['role'], self::ALLOWED_ROLES, true)) {
            $errors['role'] = "role must be one of: " . implode(', ', self::ALLOWED_ROLES);
        }

        // Optional field: isActive
        if (isset($data['isActive']) && !is_bool($data['isActive'])) {
            $errors['isActive'] = "isActive must be a boolean";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate password strength
     * 
     * Requirements:
     * - At least 8 characters
     * - At least one uppercase letter (A-Z)
     * - At least one lowercase letter (a-z)
     * - At least one number (0-9)
     * - At least one special character (!@#$%^&*)
     * 
     * @param string $password Password to validate
     * @return array Result: ['valid' => bool, 'message' => string]
     */
    public static function validatePasswordStrength(string $password): array {
        if (strlen($password) < self::PASSWORD_MIN) {
            return [
                'valid' => false,
                'message' => "Password must be at least " . self::PASSWORD_MIN . " characters long"
            ];
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return [
                'valid' => false,
                'message' => "Password must contain at least one uppercase letter (A-Z)"
            ];
        }

        if (!preg_match('/[a-z]/', $password)) {
            return [
                'valid' => false,
                'message' => "Password must contain at least one lowercase letter (a-z)"
            ];
        }

        if (!preg_match('/[0-9]/', $password)) {
            return [
                'valid' => false,
                'message' => "Password must contain at least one number (0-9)"
            ];
        }

        if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
            return [
                'valid' => false,
                'message' => "Password must contain at least one special character (!@#$%^&*)"
            ];
        }

        return [
            'valid' => true,
            'message' => "Password is strong"
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
