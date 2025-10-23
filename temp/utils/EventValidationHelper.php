<?php
/**
 * @fileoverview Event Validation Helper
 * 
 * Server-side validation for event-related DTOs
 * Performs type checking, required field validation, and business rule validation
 * 
 * Validation Rules:
 * - Type validation: Ensure fields match DTO types (string, int, bool, null)
 * - Required field validation: Check mandatory fields are present and non-empty
 * - Enum validation: Validate status against allowed values (active, cancelled, completed)
 * - Format validation: Validate date formats (YYYY-MM-DD)
 * - Length validation: Title (3-255), description (10-5000), location (3-255)
 * - Date logic validation: startDate in future, endDate >= startDate
 * - Capacity validation: Positive integer or null
 * - Business rule validation: Check constraints
 * 
 * No frontend validation - all validation happens server-side
 *
 * @author CCSync Development Team
 * @version 1.0
 */

class EventValidationHelper {

    // Allowed values (enums)
    public const ALLOWED_STATUSES = ['active', 'cancelled', 'completed'];
    public const ALLOWED_PARTICIPANT_STATUSES = ['attended', 'absent', 'pending'];
    public const ALLOWED_POINT_REASONS = ['attended', 'officer_conducted', 'helped_organize'];

    // String length constraints
    public const TITLE_MIN = 3;
    public const TITLE_MAX = 255;
    public const DESCRIPTION_MIN = 10;
    public const DESCRIPTION_MAX = 5000;
    public const LOCATION_MIN = 3;
    public const LOCATION_MAX = 255;

    /**
     * Validate EventCreateDTO data
     * 
     * Validates data structure matches EventCreateDTO requirements:
     * - Required fields: title, description, startDate, location
     * - Type checking: Ensure correct data types
     * - Business rules: Validate enum values, date formats, string lengths, date logic
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateEventCreateDTO(array $data): array {
        $errors = [];

        // Required fields check
        $required = ['title', 'description', 'startDate', 'location'];
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

        // Type validation - startDate
        if (!is_string($data['startDate']) || !self::isValidDate($data['startDate'])) {
            $errors['startDate'] = "startDate must be in YYYY-MM-DD format";
        } else {
            // Check if startDate is in the future
            $startDateTime = strtotime($data['startDate']);
            $todayTime = strtotime(date('Y-m-d'));
            if ($startDateTime < $todayTime) {
                $errors['startDate'] = "startDate must be a future date";
            }
        }

        // Type validation - location
        if (!is_string($data['location']) || empty(trim($data['location']))) {
            $errors['location'] = "location must be a non-empty string";
        } else {
            $locationLength = strlen(trim($data['location']));
            if ($locationLength < self::LOCATION_MIN || $locationLength > self::LOCATION_MAX) {
                $errors['location'] = "location must be between " . self::LOCATION_MIN . " and " . self::LOCATION_MAX . " characters";
            }
        }

        // Optional fields validation - endDate
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

        // Optional fields validation - capacity
        if (isset($data['capacity']) && $data['capacity'] !== null) {
            if (!is_int($data['capacity']) || $data['capacity'] <= 0) {
                $errors['capacity'] = "capacity must be a positive integer or null";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate EventUpdateDTO data
     * 
     * Validates data structure matches EventUpdateDTO requirements:
     * - All fields optional (partial update)
     * - Type checking for provided fields
     * - Business rules for provided fields
     * - Date constraints
     * 
     * @param array $data Raw data to validate
     * @param ?array $existingEvent Existing event data for constraint validation (optional)
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateEventUpdateDTO(array $data, ?array $existingEvent = null): array {
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

        // Optional field: startDate
        if (isset($data['startDate']) && $data['startDate'] !== null && $data['startDate'] !== '') {
            if (!is_string($data['startDate']) || !self::isValidDate($data['startDate'])) {
                $errors['startDate'] = "startDate must be in YYYY-MM-DD format";
            } else {
                $startDateTime = strtotime($data['startDate']);
                $todayTime = strtotime(date('Y-m-d'));
                if ($startDateTime < $todayTime) {
                    $errors['startDate'] = "startDate must be a future date";
                }
            }
        }

        // Optional field: endDate
        if (isset($data['endDate'])) {
            if ($data['endDate'] !== null && $data['endDate'] !== '') {
                if (!is_string($data['endDate']) || !self::isValidDate($data['endDate'])) {
                    $errors['endDate'] = "endDate must be in YYYY-MM-DD format";
                } else {
                    // Get startDate for comparison
                    $startDate = $data['startDate'] ?? ($existingEvent['startDate'] ?? null);
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

        // Optional field: location
        if (isset($data['location']) && $data['location'] !== null && $data['location'] !== '') {
            if (!is_string($data['location']) || empty(trim($data['location']))) {
                $errors['location'] = "location must be a non-empty string";
            } else {
                $locationLength = strlen(trim($data['location']));
                if ($locationLength < self::LOCATION_MIN || $locationLength > self::LOCATION_MAX) {
                    $errors['location'] = "location must be between " . self::LOCATION_MIN . " and " . self::LOCATION_MAX . " characters";
                }
            }
        }

        // Optional field: capacity
        if (isset($data['capacity']) && $data['capacity'] !== null) {
            if (!is_int($data['capacity']) || $data['capacity'] <= 0) {
                $errors['capacity'] = "capacity must be a positive integer or null";
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
     * Validate EventQueryDTO data
     * 
     * Validates search/filter criteria
     * All fields optional
     * 
     * @param array $data Raw query data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateEventQueryDTO(array $data): array {
        $errors = [];

        // Optional field: title (LIKE search)
        if (isset($data['title']) && !is_string($data['title']) && $data['title'] !== null) {
            $errors['title'] = "title must be a string or null";
        }

        // Optional field: status (enum)
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_STATUSES, true)) {
            $errors['status'] = "status must be one of: " . implode(', ', self::ALLOWED_STATUSES);
        }

        // Optional field: startDate (date range)
        if (isset($data['startDate']) && !self::isValidDate($data['startDate'])) {
            $errors['startDate'] = "startDate must be in YYYY-MM-DD format";
        }

        // Optional field: endDate (date range)
        if (isset($data['endDate']) && !self::isValidDate($data['endDate'])) {
            $errors['endDate'] = "endDate must be in YYYY-MM-DD format";
        }

        // Optional field: location (LIKE search)
        if (isset($data['location']) && !is_string($data['location']) && $data['location'] !== null) {
            $errors['location'] = "location must be a string or null";
        }

        // Optional field: createdBy (exact match)
        if (isset($data['createdBy']) && !is_int($data['createdBy']) && $data['createdBy'] !== null) {
            $errors['createdBy'] = "createdBy must be an integer or null";
        }

        // Optional field: upcomingOnly (boolean filter)
        if (isset($data['upcomingOnly']) && !is_bool($data['upcomingOnly'])) {
            $errors['upcomingOnly'] = "upcomingOnly must be a boolean";
        }

        // Optional field: hasAvailability (boolean filter)
        if (isset($data['hasAvailability']) && !is_bool($data['hasAvailability'])) {
            $errors['hasAvailability'] = "hasAvailability must be a boolean";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate EventParticipantDTO data
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateEventParticipantDTO(array $data): array {
        $errors = [];

        // Required fields
        $required = ['eventId', 'memberId', 'status'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        // Type validation - eventId
        if (isset($data['eventId']) && (!is_int($data['eventId']) || $data['eventId'] <= 0)) {
            $errors['eventId'] = "eventId must be a positive integer";
        }

        // Type validation - memberId
        if (isset($data['memberId']) && (!is_int($data['memberId']) || $data['memberId'] <= 0)) {
            $errors['memberId'] = "memberId must be a positive integer";
        }

        // Type validation - status
        if (isset($data['status']) && !in_array($data['status'], self::ALLOWED_PARTICIPANT_STATUSES, true)) {
            $errors['status'] = "status must be one of: " . implode(', ', self::ALLOWED_PARTICIPANT_STATUSES);
        }

        // Optional field: feedback
        if (isset($data['feedback']) && !is_string($data['feedback']) && $data['feedback'] !== null) {
            $errors['feedback'] = "feedback must be a string or null";
        }

        // Optional field: hasPoints
        if (isset($data['hasPoints']) && !is_bool($data['hasPoints'])) {
            $errors['hasPoints'] = "hasPoints must be a boolean";
        }

        // Optional field: pointsEarned
        if (isset($data['pointsEarned']) && (!is_int($data['pointsEarned']) || $data['pointsEarned'] < 0)) {
            $errors['pointsEarned'] = "pointsEarned must be a non-negative integer";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Validate EventActivityPointDTO data
     * 
     * @param array $data Raw data to validate
     * @return array Validation result: ['valid' => bool, 'errors' => array]
     */
    public static function validateEventActivityPointDTO(array $data): array {
        $errors = [];

        // Required fields
        $required = ['eventId', 'memberId', 'points', 'reason'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $errors[$field] = "Required field missing: $field";
            }
        }

        // Type validation - eventId
        if (isset($data['eventId']) && (!is_int($data['eventId']) || $data['eventId'] <= 0)) {
            $errors['eventId'] = "eventId must be a positive integer";
        }

        // Type validation - memberId
        if (isset($data['memberId']) && (!is_int($data['memberId']) || $data['memberId'] <= 0)) {
            $errors['memberId'] = "memberId must be a positive integer";
        }

        // Type validation - points
        if (isset($data['points']) && (!is_int($data['points']) || $data['points'] <= 0)) {
            $errors['points'] = "points must be a positive integer";
        }

        // Type validation - reason (enum)
        if (isset($data['reason']) && !in_array($data['reason'], self::ALLOWED_POINT_REASONS, true)) {
            $errors['reason'] = "reason must be one of: " . implode(', ', self::ALLOWED_POINT_REASONS);
        }

        // Optional field: notes
        if (isset($data['notes']) && !is_string($data['notes']) && $data['notes'] !== null) {
            $errors['notes'] = "notes must be a string or null";
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
