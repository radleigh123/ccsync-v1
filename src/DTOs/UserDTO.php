<?php
/**
 * @fileoverview User Data Transfer Objects
 * 
 * Canonical user entity definitions for registration and management
 * Separate from MemberDTO - users can exist without being members
 * 
 * Structure:
 * - UserDTO: Complete user profile (read operations)
 * - UserRegisterDTO: Data for user self-registration
 * - UserCreateDTO: Data for admin user creation
 * - UserUpdateDTO: Data for user profile updates
 * - UserPasswordDTO: Data for password changes
 * - UserQueryDTO: User search/filtering
 * - UserAuthDTO: Authentication response data
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete User Profile DTO
 * 
 * Represents all user information in the system
 * Used for read operations and API responses
 * 
 * Field Mapping:
 * - id: Primary key
 * - idNumber: School ID (unique identifier)
 * - firstName/lastName: User's name
 * - email: User's email (unique)
 * - role: User role (student, officer, admin)
 * - isActive: Account status
 * - createdAt: Account creation timestamp
 * - updatedAt: Last update timestamp
 * 
 * @interface
 */
class UserDTO {
    public int $id;                              // Primary key
    public string $idNumber;                     // School ID (unique)
    public string $firstName;                    // First name
    public string $lastName;                     // Last name
    public ?string $suffix;                      // Name suffix (Jr., Sr., etc.)
    public string $email;                        // Email address (unique)
    public string $role;                         // student, officer, admin
    public bool $isActive;                       // Account active?
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * User Self-Registration DTO
 * 
 * Data structure for user self-registration (public signup)
 * Includes validation for new user account creation
 * 
 * Required fields:
 * - idNumber (required, unique, school ID)
 * - firstName (required, string)
 * - lastName (required, string)
 * - email (required, unique, valid email)
 * - password (required, min 8 chars, strong)
 * - passwordConfirm (required, must match password)
 * 
 * Optional fields:
 * - suffix (optional, Jr., Sr., III, etc.)
 * 
 * System-generated fields (server-side):
 * - id (auto-increment)
 * - role (default: 'student')
 * - isActive (default: true, or require email verification)
 * - createdAt, updatedAt (current timestamp)
 * 
 * @interface
 */
class UserRegisterDTO {
    public string $idNumber;                     // School ID (required, unique)
    public string $firstName;                    // Required (min 2, max 50)
    public string $lastName;                     // Required (min 2, max 50)
    public ?string $suffix;                      // Optional (Jr., Sr., III, etc.)
    public string $email;                        // Required (unique, valid email)
    public string $password;                     // Required (min 8, must be strong)
    public string $passwordConfirm;              // Required (must match password)
}

/**
 * User Creation by Admin DTO
 * 
 * Data structure for admin creating new user accounts
 * Similar to UserRegisterDTO but can skip password (send reset link instead)
 * Admin can also set role and other fields
 * 
 * Required fields:
 * - idNumber (required, unique)
 * - firstName (required)
 * - lastName (required)
 * - email (required, unique)
 * 
 * Optional fields:
 * - suffix (optional)
 * - password (optional, if not provided, send password reset link)
 * - role (optional, default: 'student')
 * 
 * @interface
 */
class UserCreateDTO {
    public string $idNumber;                     // Required (unique)
    public string $firstName;                    // Required
    public string $lastName;                     // Required
    public ?string $suffix;                      // Optional
    public string $email;                        // Required (unique)
    public ?string $password;                    // Optional (if not provided, send reset link)
    public ?string $role;                        // Optional (default: 'student')
}

/**
 * User Profile Update DTO
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Immutable fields (cannot update):
 * - id, idNumber, createdAt, role (unless admin)
 * 
 * Updatable fields:
 * - firstName, lastName, suffix, email (if verification enabled)
 * 
 * @interface
 */
class UserUpdateDTO {
    public ?string $firstName;                   // Optional (min 2, max 50)
    public ?string $lastName;                    // Optional (min 2, max 50)
    public ?string $suffix;                      // Optional
    public ?string $email;                       // Optional (unique, if email verification enabled)
}

/**
 * User Password Change DTO
 * 
 * Data for password change operations
 * Current password required for verification
 * 
 * Required fields:
 * - currentPassword (required, for verification)
 * - newPassword (required, min 8, strong)
 * - newPasswordConfirm (required, must match newPassword)
 * 
 * @interface
 */
class UserPasswordDTO {
    public string $currentPassword;              // Required (for verification)
    public string $newPassword;                  // Required (min 8, strong)
    public string $newPasswordConfirm;           // Required (must match)
}

/**
 * User Search/Filter Query
 * 
 * Used for finding users by various criteria
 * All fields optional - search only by fields that are specified
 * 
 * @interface
 */
class UserQueryDTO {
    public ?string $idNumber;                    // Exact match or partial LIKE
    public ?string $firstName;                   // Partial LIKE search
    public ?string $lastName;                    // Partial LIKE search
    public ?string $email;                       // Partial LIKE search
    public ?string $role;                        // Exact match (student, officer, admin)
    public ?bool $isActive;                      // Filter: active/inactive accounts
}

/**
 * User Authentication Response DTO
 * 
 * Data returned after successful authentication
 * Minimal info needed for frontend to display and track user session
 * 
 * @interface
 */
class UserAuthDTO {
    public int $id;                              // User ID
    public string $idNumber;                     // School ID
    public string $firstName;                    // First name
    public string $lastName;                     // Last name
    public string $email;                        // Email
    public string $role;                         // User role
    public string $token;                        // Session/JWT token (if using tokens)
    public string $loginAt;                      // ISO 8601 timestamp of login
}

?>
