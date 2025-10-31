<?php
/**
 * @fileoverview User Data Transfer Objects (Schema-Aligned)
 * 
 * Restructured to match ccsync_api.users table schema exactly
 * Single source of truth: DTOs ≡ Database Schema
 * 
 * Database Schema Reference:
 * - id: bigint(20) UNSIGNED PRIMARY KEY
 * - name: varchar(255) - Full name (SINGLE FIELD)
 * - email: varchar(255) UNIQUE
 * - email_verified_at: timestamp NULL
 * - firebase_uid: varchar(255) UNIQUE NULL
 * - id_school_number: int(10) UNSIGNED UNIQUE
 * - password: varchar(255) - bcrypt hash
 * - role: enum('user','admin','guest') DEFAULT 'user'
 * - remember_token: varchar(100) NULL
 * - created_at, updated_at: timestamp NULL
 * 
 * Structure:
 * - UserDTO: Complete user profile (read operations)
 * - UserCreateDTO: Data for user creation
 * - UserUpdateDTO: Data for user updates (partial fields)
 * - UserQueryDTO: User search/filtering
 * - UserAuthDTO: Authentication response data
 *
 * @author CCSync Development Team
 * @version 2.0 (Schema-Aligned)
 */

/**
 * Complete User Profile DTO
 * 
 * Represents complete user information exactly as stored in database
 * Used for read operations and API responses
 * 
 * Maps directly to ccsync_api.users table structure
 * No transformation needed - use toArray() for database operations
 * 
 * @interface
 */
class UserDTO {
    /**
     * User's unique identifier (Primary Key)
     * @var int
     */
    public int $id;

    /**
     * User's full name (SINGLE FIELD - not split into first/last)
     * Maps to: users.name
     * @var string
     */
    public string $name;

    /**
     * User's email address (UNIQUE)
     * @var string
     */
    public string $email;

    /**
     * Email verification timestamp
     * NULL if email not yet verified
     * @var string|null
     */
    public ?string $emailVerifiedAt;

    /**
     * Firebase authentication UID (UNIQUE, nullable)
     * NULL if user not authenticated via Firebase
     * @var string|null
     */
    public ?string $firebaseUid;

    /**
     * User's school ID number (UNIQUE)
     * Maps to: users.id_school_number
     * @var int
     */
    public int $idSchoolNumber;

    /**
     * User's role in the system
     * Valid values: 'user', 'admin', 'guest'
     * @var string
     */
    public string $role;

    /**
     * Remember token for "Remember Me" functionality
     * @var string|null
     */
    public ?string $rememberToken;

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
 * User Creation DTO
 * 
 * Data structure for creating new user accounts
 * Can be used by admin or during self-registration
 * 
 * Required fields for creation:
 * - name (required, string)
 * - email (required, unique, valid email)
 * - id_school_number (required, unique, int)
 * - password (optional for admin-created users - send reset link)
 * 
 * Optional fields:
 * - firebase_uid (optional, for Firebase auth)
 * - role (optional, default: 'user')
 * 
 * System-generated fields (server creates):
 * - id, created_at, updated_at, email_verified_at
 * 
 * @interface
 */
class UserCreateDTO {
    /**
     * User's full name
     * @var string
     */
    public string $name;

    /**
     * User's email address
     * @var string
     */
    public string $email;

    /**
     * User's school ID number
     * @var int
     */
    public int $idSchoolNumber;

    /**
     * User's password (bcrypt will be applied server-side)
     * Optional - if not provided, admin can send reset link
     * @var string|null
     */
    public ?string $password;

    /**
     * User's role in the system (default: 'user')
     * @var string
     */
    public string $role;

    /**
     * Firebase authentication UID (optional)
     * @var string|null
     */
    public ?string $firebaseUid;
}

/**
 * User Profile Update DTO
 * 
 * Partial subset for selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, id_school_number, created_at, role (admin-only)
 * 
 * Updatable fields:
 * - name, email (if verification enabled)
 * 
 * @interface
 */
class UserUpdateDTO {
    /**
     * Updated user name (optional)
     * @var string|null
     */
    public ?string $name;

    /**
     * Updated email address (optional)
     * @var string|null
     */
    public ?string $email;

    /**
     * Updated Firebase UID (optional)
     * @var string|null
     */
    public ?string $firebaseUid;
}

/**
 * User Search/Filter Query DTO
 * 
 * Used for finding users by various criteria
 * All fields optional - search only by fields that are specified
 * Supports LIKE searches for name/email, exact match for others
 * 
 * @interface
 */
class UserQueryDTO {
    /**
     * Search by school ID (exact match)
     * @var int|null
     */
    public ?int $idSchoolNumber;

    /**
     * Search by name (LIKE partial match)
     * @var string|null
     */
    public ?string $name;

    /**
     * Search by email (LIKE partial match)
     * @var string|null
     */
    public ?string $email;

    /**
     * Filter by role (exact match)
     * @var string|null
     */
    public ?string $role;

    /**
     * Filter by verification status
     * @var bool|null
     */
    public ?bool $isVerified;
}

/**
 * User Authentication Response DTO
 * 
 * Data returned after successful authentication
 * Minimal info needed for frontend session tracking
 * 
 * @interface
 */
class UserAuthDTO {
    /**
     * User ID
     * @var int
     */
    public int $id;

    /**
     * User's full name
     * @var string
     */
    public string $name;

    /**
     * School ID number
     * @var int
     */
    public int $idSchoolNumber;

    /**
     * User's email
     * @var string
     */
    public string $email;

    /**
     * User's role
     * @var string
     */
    public string $role;

    /**
     * Session/JWT token (if using tokens)
     * @var string|null
     */
    public ?string $token;

    /**
     * Login timestamp
     * @var string|null
     */
    public ?string $loginAt;
}

?>
