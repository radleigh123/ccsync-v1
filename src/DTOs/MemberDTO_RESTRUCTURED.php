<?php
/**
 * @fileoverview Member Data Transfer Objects (Schema-Aligned)
 * 
 * Restructured to match ccsync_api.members table schema exactly
 * Single source of truth: DTOs ≡ Database Schema
 * 
 * Database Schema Reference:
 * - id: bigint(20) UNSIGNED PRIMARY KEY
 * - first_name: varchar(255)
 * - last_name: varchar(255)
 * - suffix: varchar(50) NULL
 * - id_school_number: int(10) UNSIGNED UNIQUE
 * - email: varchar(255) UNIQUE NULL
 * - birth_date: date
 * - enrollment_date: date
 * - program: varchar(255) FK to programs.code
 * - year: tinyint(3) UNSIGNED (1-4)
 * - is_paid: tinyint(1) (0 or 1, maps to bool)
 * - created_at, updated_at: timestamp NULL
 * 
 * Key Points:
 * - NO userId field (members table is independent)
 * - NO semester_id field (future enhancement)
 * - first_name/last_name are separate fields (not single name)
 * - year field stores 1-4 (not yearLevel)
 * - is_paid is tinyint, maps to PHP bool
 * 
 * Structure:
 * - MemberDTO: Complete member profile (read operations)
 * - MemberCreateDTO: Data for member registration
 * - MemberUpdateDTO: Data for member updates (partial fields)
 * - MemberQueryDTO: Member search/filtering
 *
 * @author CCSync Development Team
 * @version 2.0 (Schema-Aligned)
 */

/**
 * Complete Member Profile DTO
 * 
 * Represents complete member information exactly as stored in database
 * Used for read operations and API responses
 * 
 * Maps directly to ccsync_api.members table structure
 * No transformation needed - use toArray() for database operations
 * 
 * IMPORTANT: Members table is independent (no userId FK)
 * Members are identified by id_school_number
 * 
 * @interface
 */
class MemberDTO {
    /**
     * Member's unique identifier (Primary Key)
     * @var int
     */
    public int $id;

    /**
     * Member's first name
     * @var string
     */
    public string $firstName;

    /**
     * Member's last name
     * @var string
     */
    public string $lastName;

    /**
     * Member's name suffix (Jr., Sr., III, etc.)
     * Optional field
     * @var string|null
     */
    public ?string $suffix;

    /**
     * Member's school ID number (UNIQUE)
     * Maps to: members.id_school_number
     * Used for member lookup and identification
     * @var int
     */
    public int $idSchoolNumber;

    /**
     * Member's email address (UNIQUE, nullable)
     * May differ from user email
     * @var string|null
     */
    public ?string $email;

    /**
     * Member's birth date
     * Format: YYYY-MM-DD
     * Maps to: members.birth_date
     * @var string
     */
    public string $birthDate;

    /**
     * Member's enrollment date
     * Format: YYYY-MM-DD
     * Date when member joined the organization
     * @var string
     */
    public string $enrollmentDate;

    /**
     * Member's academic program
     * Valid values: BSCS, BSIS, BSIT, BSCE
     * Foreign key to programs.code
     * @var string
     */
    public string $program;

    /**
     * Member's year level in program
     * Valid values: 1, 2, 3, 4
     * Maps to: members.year (tinyint)
     * @var int
     */
    public int $year;

    /**
     * Member's payment status
     * TRUE = membership dues paid
     * FALSE = membership dues not yet paid
     * Maps to: members.is_paid (tinyint 0/1)
     * @var bool
     */
    public bool $isPaid;

    /**
     * Record creation timestamp
     * @var string|null
     */
    public ?string $createdAt;

    /**
     * Record last update timestamp
     * @var string|null
     */
    public ?string $updatedAt;
}

/**
 * Member Registration/Creation DTO
 * 
 * Data structure for creating new member records
 * Typically follows user registration or lookup
 * 
 * Required fields:
 * - first_name, last_name, id_school_number
 * - birth_date, program, year
 * - enrollment_date (server can default to today)
 * 
 * Optional fields:
 * - suffix, email, is_paid
 * 
 * System-generated fields (server creates):
 * - id, created_at, updated_at
 * 
 * @interface
 */
class MemberCreateDTO {
    /**
     * Member's first name (required)
     * @var string
     */
    public string $firstName;

    /**
     * Member's last name (required)
     * @var string
     */
    public string $lastName;

    /**
     * Member's name suffix (optional)
     * @var string|null
     */
    public ?string $suffix;

    /**
     * Member's school ID number (required, unique)
     * @var int
     */
    public int $idSchoolNumber;

    /**
     * Member's email (optional)
     * @var string|null
     */
    public ?string $email;

    /**
     * Member's birth date (required)
     * Format: YYYY-MM-DD
     * @var string
     */
    public string $birthDate;

    /**
     * Member's enrollment date (required)
     * Format: YYYY-MM-DD
     * Defaults to today if not provided
     * @var string
     */
    public string $enrollmentDate;

    /**
     * Member's academic program (required)
     * Valid: BSCS, BSIS, BSIT, BSCE
     * @var string
     */
    public string $program;

    /**
     * Member's year level (required)
     * Valid: 1, 2, 3, 4
     * @var int
     */
    public int $year;

    /**
     * Member's payment status (optional)
     * Defaults to false (not paid)
     * @var bool
     */
    public bool $isPaid;
}

/**
 * Member Profile Update DTO
 * 
 * Partial subset for selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, first_name, last_name, id_school_number, created_at
 * 
 * Updatable fields:
 * - suffix, email, birth_date, program, year, is_paid, enrollment_date
 * 
 * @interface
 */
class MemberUpdateDTO {
    /**
     * Updated name suffix (optional)
     * @var string|null
     */
    public ?string $suffix;

    /**
     * Updated email (optional)
     * @var string|null
     */
    public ?string $email;

    /**
     * Updated birth date (optional)
     * Format: YYYY-MM-DD
     * @var string|null
     */
    public ?string $birthDate;

    /**
     * Updated enrollment date (optional)
     * Format: YYYY-MM-DD
     * @var string|null
     */
    public ?string $enrollmentDate;

    /**
     * Updated program (optional)
     * @var string|null
     */
    public ?string $program;

    /**
     * Updated year level (optional)
     * Valid: 1, 2, 3, 4
     * @var int|null
     */
    public ?int $year;

    /**
     * Updated payment status (optional)
     * @var bool|null
     */
    public ?bool $isPaid;
}

/**
 * Member Search/Filter Query DTO
 * 
 * Used for finding members by various criteria
 * All fields optional - search only by fields that are specified
 * Supports exact matching and partial LIKE searches
 * 
 * @interface
 */
class MemberQueryDTO {
    /**
     * Search by school ID (exact match)
     * @var int|null
     */
    public ?int $idSchoolNumber;

    /**
     * Search by first name (LIKE partial match)
     * @var string|null
     */
    public ?string $firstName;

    /**
     * Search by last name (LIKE partial match)
     * @var string|null
     */
    public ?string $lastName;

    /**
     * Search by program (exact match)
     * @var string|null
     */
    public ?string $program;

    /**
     * Filter by year level (exact match)
     * @var int|null
     */
    public ?int $year;

    /**
     * Filter by payment status
     * TRUE = paid members only
     * FALSE = unpaid members only
     * NULL = all members
     * @var bool|null
     */
    public ?bool $isPaid;
}

?>
