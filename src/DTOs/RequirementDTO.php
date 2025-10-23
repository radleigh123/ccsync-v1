<?php
/**
 * @fileoverview Requirement Data Transfer Objects
 * 
 * Canonical requirement entity definitions - single source of truth for all requirement-related data structures
 * 
 * Requirements are tasks/deliverables that members must complete to fulfill membership obligations
 * Examples: Attendance quota, organization service hours, activity points, payment status, etc.
 * 
 * Structure:
 * - RequirementDTO: Complete requirement profile (read operations)
 * - RequirementCreateDTO: Data for requirement creation
 * - RequirementUpdateDTO: Data for requirement updates (partial fields)
 * - RequirementQueryDTO: Data for requirement search/filtering
 * - MemberRequirementDTO: Member's progress on a specific requirement
 * - RequirementProgressDTO: Member's overall requirement progress
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete Requirement Profile DTO
 * 
 * Represents a membership requirement/criteria
 * Used for read operations and API responses
 * 
 * Field Mapping:
 * - id: Primary key
 * - title: Requirement name/title
 * - description: Detailed description of requirement
 * - type: Type of requirement (attendance, service_hours, activity_points, payment, custom)
 * - targetValue: Goal/threshold value (e.g., 80% for attendance)
 * - unit: Unit of measurement (percentage, hours, points, etc.)
 * - isActive: Whether this requirement is currently enforced
 * - semesterId: Which semester this applies to (optional, null = applies to all)
 * 
 * @interface
 */
class RequirementDTO {
    public int $id;                              // Primary key
    public string $title;                        // Requirement name
    public string $description;                  // Detailed description
    public string $type;                         // attendance, service_hours, activity_points, payment, custom
    public float $targetValue;                   // Target/threshold value
    public string $unit;                         // %, hours, points, custom_unit
    public bool $isActive;                       // Currently enforced?
    public ?int $semesterId;                     // Optional: semester scope (null = all semesters)
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Requirement Data for Creation
 * 
 * Subset of RequirementDTO used when creating new requirements
 * Contains only fields needed during requirement creation
 * 
 * Required fields:
 * - title (required, min 3, max 100)
 * - description (required, min 10, max 500)
 * - type (required, enum: attendance, service_hours, activity_points, payment, custom)
 * - targetValue (required, float > 0)
 * - unit (required, string)
 * 
 * Optional fields:
 * - isActive (default: true)
 * - semesterId (optional, semester scope)
 * 
 * System-generated fields (server-side):
 * - id (generated on insert)
 * - createdAt (current timestamp)
 * - updatedAt (current timestamp)
 * 
 * @interface
 */
class RequirementCreateDTO {
    public string $title;                        // Required (min 3, max 100)
    public string $description;                  // Required (min 10, max 500)
    public string $type;                         // Required (attendance, service_hours, activity_points, payment, custom)
    public float $targetValue;                   // Required (> 0)
    public string $unit;                         // Required (%, hours, points, pesos, etc.)
    public ?bool $isActive;                      // Optional (default: true)
    public ?int $semesterId;                     // Optional (null = applies to all)
}

/**
 * Requirement Data for Updates
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, type, createdAt
 * 
 * Updatable fields:
 * - title, description, targetValue, unit, isActive, semesterId
 * 
 * @interface
 */
class RequirementUpdateDTO {
    public ?string $title;                       // Optional (min 3, max 100 if provided)
    public ?string $description;                 // Optional (min 10, max 500 if provided)
    public ?float $targetValue;                  // Optional (> 0 if provided)
    public ?string $unit;                        // Optional (string if provided)
    public ?bool $isActive;                      // Optional (boolean)
    public ?int $semesterId;                     // Optional (nullable)
}

/**
 * Requirement Search/Filter Query
 * 
 * Used for finding requirements by various criteria
 * All fields optional - search only by fields that are specified
 * 
 * @interface
 */
class RequirementQueryDTO {
    public ?string $type;                        // Exact match
    public ?bool $isActive;                      // Filter: active requirements only
    public ?int $semesterId;                     // Exact match (filter by semester)
}

/**
 * Member Requirement Progress DTO
 * 
 * Tracks a member's progress on a specific requirement
 * Links members to requirements with current value/status
 * 
 * Field Mapping:
 * - memberId: Foreign key to members
 * - requirementId: Foreign key to requirements
 * - currentValue: Member's current progress (e.g., 75% attendance, 12 activity points)
 * - status: Not Started, In Progress, Completed, Failed
 * - lastUpdated: When this progress was last recorded
 * 
 * @interface
 */
class MemberRequirementDTO {
    public int $memberId;                        // FK to members
    public int $requirementId;                   // FK to requirements
    public string $memberName;                   // Member's full name (from join)
    public string $requirementTitle;             // Requirement title (from join)
    public float $currentValue;                  // Member's current progress
    public float $targetValue;                   // Target value (from requirement)
    public float $percentProgress;               // Calculated percentage (current / target * 100)
    public string $status;                       // Not Started, In Progress, Completed, Failed
    public bool $isMet;                          // Whether requirement is met (currentValue >= targetValue)
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Member Overall Requirement Progress DTO
 * 
 * Summary of member's progress across ALL active requirements
 * Used for member dashboard and progress reports
 * 
 * @interface
 */
class RequirementProgressDTO {
    public int $memberId;                        // Member ID
    public string $memberName;                   // Member's full name
    public int $totalRequirements;               // Total number of active requirements
    public int $metRequirements;                 // Number of requirements met
    public int $inProgressRequirements;          // Number of requirements in progress
    public int $notMetRequirements;              // Number of requirements not met
    public float $overallProgress;               // Overall progress percentage (metRequirements / totalRequirements * 100)
    public bool $allMetRequirements;             // Whether all requirements are met
    public array $requirementDetails;            // Array of MemberRequirementDTO for each requirement
    public string $updatedAt;                    // When summary was last calculated
}

/**
 * Requirement Fulfillment Event DTO
 * 
 * Records when a member fulfills a requirement or updates progress
 * Used for audit trail and progress tracking
 * 
 * @interface
 */
class RequirementFulfillmentDTO {
    public int $id;                              // Primary key
    public int $memberId;                        // FK to members
    public int $requirementId;                   // FK to requirements
    public float $valueAdded;                    // Amount of progress added
    public string $reason;                       // attendance_event, activity_points_earned, manual_adjustment, payment_received, etc.
    public ?string $notes;                       // Optional notes about the fulfillment
    public int $recordedBy;                      // User ID who recorded this (admin/officer)
    public string $recordedAt;                   // ISO 8601 timestamp
}

?>
