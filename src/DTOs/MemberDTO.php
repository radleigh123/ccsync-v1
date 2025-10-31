<?php
/**
 * @fileoverview Member Data Transfer Objects
 * 
 * Canonical member entity definitions - single source of truth for all member-related data structures
 * 
 * Structure:
 * - MemberDTO: Complete member profile (read operations)
 * - MemberCreateDTO: Data for member creation/registration
 * - MemberUpdateDTO: Data for member updates (partial fields)
 * - MemberQueryDTO: Data for member search/filtering
 * - MemberRegistrationFormDTO: Response for registration form pre-fill
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete Member Profile DTO
 * 
 * Represents all member information in the system
 * Used for read operations and API responses
 * 
 * Field Mapping:
 * - idNumber: School ID (canonical identifier for member lookup)
 * - firstName/lastName: Member's name (auto-filled from user)
 * - birthDate: Member's birth date (user input)
 * - program: Academic program (user input)
 * - yearLevel: Year level 1-4 (user input)
 * - isPaid: Payment status (tracks membership dues)
 * 
 * @interface
 */
class MemberDTO {
    public int $id;                              // Primary key
    public int $userId;                          // Foreign key to users table
    public string $idNumber;                     // School ID (canonical identifier)
    public string $firstName;                    // Auto-filled from user
    public string $lastName;                     // Auto-filled from user
    public string $email;                        // Auto-filled from user
    public ?string $suffix;                      // Optional: Jr., Sr., III, etc.
    public string $birthDate;                    // YYYY-MM-DD format (user input)
    public string $enrollmentDate;               // YYYY-MM-DD format
    public string $program;                      // BSIT, BSCS, BSIS, etc. (user input)
    public int $yearLevel;                       // 1-4 (user input)
    public bool $isPaid;                         // Payment status
    public ?int $semesterId;                     // Optional: Links to semester (future use)
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Member Profile Data for Creation/Registration
 * 
 * Subset of MemberDTO used when registering new members
 * Contains only fields needed during registration process
 * 
 * IMPORTANT: userId is intentionally NOT stored in members table
 * Members are uniquely identified by idNumber (school ID), which is the canonical identifier
 * This allows members to be tracked independently of user accounts
 * 
 * Auto-filled fields (from user lookup):
 * - firstName, lastName, email, idNumber
 * 
 * User-provided fields:
 * - birthDate (required), program (required), yearLevel (required)
 * - suffix (optional), isPaid (optional, default: false)
 * 
 * @interface
 */
class MemberCreateDTO {
    public string $idNumber;                     // From user lookup (canonical identifier)
    public string $firstName;                    // From user snapshot
    public string $lastName;                     // From user snapshot
    public string $email;                        // From user snapshot
    public ?string $suffix;                      // User input (optional)
    public string $birthDate;                    // User input (required, YYYY-MM-DD)
    public string $program;                      // User input (required, enum: BSIT|BSCS|BSIS)
    public int $yearLevel;                       // User input (required, range: 1-4)
    public bool $isPaid;                         // User input (optional, default: false)
    public ?string $enrollmentDate;              // Default: today (YYYY-MM-DD)
    public ?int $semesterId;                     // Optional (future: semester scoping)
}

/**
 * Member Profile Data for Updates
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - userId, idNumber, firstName, lastName, email (user info)
 * 
 * Updatable fields:
 * - suffix, birthDate, program, yearLevel, isPaid, semesterId
 * 
 * @interface
 */
class MemberUpdateDTO {
    public ?string $suffix;
    public ?string $birthDate;                   // YYYY-MM-DD format
    public ?string $program;
    public ?int $yearLevel;                      // 1-4
    public ?bool $isPaid;
    public ?int $semesterId;
}

/**
 * Member Search/Filter Query
 * 
 * Used for finding members by various criteria
 * All fields optional - search only by fields that are specified
 * 
 * @interface
 */
class MemberQueryDTO {
    public ?string $idNumber;                    // Exact match
    public ?string $program;                     // Exact match
    public ?int $yearLevel;                      // Exact match (1-4)
    public ?bool $isPaid;                        // Filter by payment status
    public ?int $semesterId;                     // Filter by semester
}

/**
 * Immutable Snapshot of User Info at Registration Time
 * 
 * Captures user information state at the moment of member registration
 * Prevents data inconsistency if user info changes after registration
 * 
 * This is a read-only snapshot - do not modify after creation
 * Used internally for audit trails and data integrity
 * 
 * @interface
 */
class UserInfoSnapshotDTO {
    public int $id;                              // User ID (at snapshot time)
    public string $idNumber;                     // School ID (at snapshot time)
    public string $firstName;                    // User's first name (at snapshot time)
    public string $lastName;                     // User's last name (at snapshot time)
    public string $email;                        // User's email (at snapshot time)
    public string $capturedAt;                   // ISO 8601 timestamp when snapshot was created
}

/**
 * Response DTO for Member Registration Form Pre-fill
 * 
 * Minimal user information needed to pre-fill member registration form
 * Returned by getUserByIdNumber API endpoint
 * 
 * Only contains auto-fill fields (no editable fields)
 * 
 * @interface
 */
class MemberRegistrationFormDTO {
    public int $userId;                          // Required for member creation
    public string $idNumber;                     // School ID (unique identifier)
    public string $firstName;                    // Auto-fill field
    public string $lastName;                     // Auto-fill field
    public string $email;                        // Auto-fill field
}
?>

