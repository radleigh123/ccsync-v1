<?php
/**
 * @fileoverview Officer Data Transfer Objects
 * 
 * Canonical officer entity definitions - single source of truth for all officer-related data structures
 * 
 * Structure:
 * - OfficerDTO: Complete officer profile (read operations)
 * - OfficerCreateDTO: Data for officer creation/appointment
 * - OfficerUpdateDTO: Data for officer updates (partial fields)
 * - OfficerQueryDTO: Data for officer search/filtering
 * - OfficerTermDTO: Officer term/tenure information
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete Officer Profile DTO
 * 
 * Represents all officer information in the system
 * Used for read operations and API responses
 * 
 * Field Mapping:
 * - id: Primary key
 * - memberId: Foreign key to members table
 * - position: Officer position (President, VP, Secretary, Treasurer, etc.)
 * - startDate: Term start date (YYYY-MM-DD)
 * - endDate: Term end date (YYYY-MM-DD, nullable if currently serving)
 * - status: current, former
 * - createdAt: When record was created
 * - updatedAt: Last update timestamp
 * 
 * @interface
 */
class OfficerDTO {
    public int $id;                              // Primary key
    public int $memberId;                        // Foreign key to members
    public string $memberName;                   // Member's full name (populated from members join)
    public string $position;                     // Officer position
    public string $startDate;                    // YYYY-MM-DD format
    public ?string $endDate;                     // YYYY-MM-DD format (null if currently serving)
    public string $status;                       // current, former
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Officer Data for Creation/Appointment
 * 
 * Subset of OfficerDTO used when appointing new officers
 * Contains only fields needed during officer creation
 * 
 * Required fields:
 * - memberId (required, must exist in members table)
 * - position (required, enum: President, VP, Secretary, Treasurer, etc.)
 * - startDate (required, YYYY-MM-DD format, typically today or recent date)
 * 
 * Optional fields:
 * - endDate (optional, only if replacing outgoing officer)
 * 
 * System-generated fields (server-side):
 * - id (generated on insert)
 * - status (default: 'current')
 * - createdAt (current timestamp)
 * - updatedAt (current timestamp)
 * 
 * @interface
 */
class OfficerCreateDTO {
    public int $memberId;                        // Required (FK to members)
    public string $position;                     // Required (enum: President, VP, Secretary, Treasurer)
    public string $startDate;                    // Required (YYYY-MM-DD)
    public ?string $endDate;                     // Optional (YYYY-MM-DD, >= startDate)
}

/**
 * Officer Data for Updates
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, memberId, startDate
 * 
 * Updatable fields:
 * - position, endDate, status
 * 
 * Constraints:
 * - Can only transition status from 'current' to 'former'
 * - endDate must be >= startDate
 * - endDate must be today or later
 * 
 * @interface
 */
class OfficerUpdateDTO {
    public ?string $position;                    // Optional (enum if provided)
    public ?string $endDate;                     // Optional (YYYY-MM-DD format if provided)
    public ?string $status;                      // Optional (current, former)
}

/**
 * Officer Search/Filter Query
 * 
 * Used for finding officers by various criteria
 * All fields optional - search only by fields that are specified
 * 
 * @interface
 */
class OfficerQueryDTO {
    public ?string $position;                    // Exact match
    public ?string $status;                      // Exact match (current, former)
    public ?int $memberId;                       // Exact match
    public ?bool $currentOnly;                   // Filter: true = only current officers
}

/**
 * Officer Term/Tenure Information DTO
 * 
 * Tracks complete term history for an officer position
 * Used for audit trails and term history
 * 
 * @interface
 */
class OfficerTermDTO {
    public int $id;                              // Primary key
    public int $officerId;                       // FK to officers table
    public string $position;                     // Position held during this term
    public int $memberId;                        // FK to members (for historical record)
    public string $memberName;                   // Member name at time of term
    public string $startDate;                    // YYYY-MM-DD
    public ?string $endDate;                     // YYYY-MM-DD (null if current term)
    public int $termOrder;                       // Sequential order (1 = first term holder)
    public string $status;                       // current, former
    public int $yearsInOffice;                   // Calculated tenure in years
    public string $createdAt;                    // ISO 8601 timestamp
}

?>
