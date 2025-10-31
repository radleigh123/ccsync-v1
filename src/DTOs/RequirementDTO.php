<?php
/**
 * @fileoverview Requirement Data Transfer Objects
 * 
 * Canonical requirement entity definitions - single source of truth for all requirement-related data structures
 * Follows the same pattern as MemberDTO for consistency across the application
 * 
 * Structure:
 * - RequirementDTO: Complete requirement profile (read operations)
 * - RequirementCreateDTO: Data for requirement creation
 * - RequirementUpdateDTO: Data for requirement updates (partial fields)
 * - RequirementQueryDTO: Data for requirement search/filtering
 * - ComplianceStatusDTO: Member compliance tracking for requirements
 *
 * @author CCSync Development Team
 * @version 1.0
 */

/**
 * Complete Requirement Profile DTO
 * 
 * Represents all requirement information in the system
 * Used for read operations and API responses
 * 
 * Database Mapping (requirements table):
 * - id: Primary key (database identifier)
 * - name: Requirement name/title (max 255)
 * - description: Optional detailed description of the requirement
 * - status: Requirement status (open|closed|archived) - lifecycle indicator
 * - requirementDate: Deadline date in YYYY-MM-DD format
 * - createdAt/updatedAt: Audit timestamps
 * 
 * Status Values:
 * - 'open': Requirement is active and pending compliance
 * - 'closed': Requirement period has ended (deadline passed)
 * - 'archived': Requirement is archived and no longer active
 * 
 * @interface
 */
class RequirementDTO {
    public int $id;                              // Primary key
    public string $name;                         // Requirement title (required, max 255)
    public ?string $description;                 // Optional detailed description
    public string $status;                       // 'open', 'closed', 'archived' (default: 'open')
    public string $requirementDate;              // Deadline in YYYY-MM-DD format
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
    public ?array $complianceStats;              // Optional: compliance summary
                                                 // { complied: int, not_complied: int, pending: int }
}

/**
 * Requirement Data for Creation
 * 
 * Subset of RequirementDTO used when creating new requirements
 * Contains only fields needed during requirement creation process
 * 
 * User-provided fields:
 * - name (required, min 3, max 255): Requirement title
 * - description (optional): Detailed description
 * - requirementDate (required): Deadline date
 * - status (optional, default: 'open'): Initial status
 * 
 * Auto-set fields (server-side):
 * - id: Generated on insert
 * - createdAt/updatedAt: Set by database
 * 
 * @interface
 */
class RequirementCreateDTO {
    public string $name;                         // Required, min 3, max 255 characters
    public ?string $description;                 // Optional, can be null
    public string $requirementDate;              // Required, YYYY-MM-DD format
    public string $status = 'open';              // Default: 'open' (enum: open|closed|archived)
}

/**
 * Requirement Data for Updates
 * 
 * Partial subset allowing selective field updates
 * All fields optional - only update fields that are present
 * 
 * Updatable fields:
 * - name: Update requirement title
 * - description: Update description
 * - status: Update status (lifecycle management: open → closed → archived)
 * - requirementDate: Update deadline
 * 
 * Immutable fields (cannot update):
 * - id, createdAt (auto-managed)
 * 
 * @interface
 */
class RequirementUpdateDTO {
    public ?string $name;                        // Optional update (min 3, max 255 if provided)
    public ?string $description;                 // Optional update
    public ?string $status;                      // Optional update (open|closed|archived)
    public ?string $requirementDate;             // Optional update, YYYY-MM-DD format
}

/**
 * Requirement Search/Filter Query
 * 
 * Used for finding requirements by various criteria
 * All fields optional - search only by fields that are specified
 * Implements multi-tier filtering like member search
 * 
 * Tier 1: Text search
 * - name: Search requirement name (case-insensitive, partial match)
 * 
 * Tier 2: Status filter
 * - status: Filter by requirement status
 * 
 * @interface
 */
class RequirementQueryDTO {
    public ?string $name;                        // Text search by requirement name
    public ?string $status;                      // Filter by status (open|closed|archived)
    public ?int $page = 1;                       // Pagination page number
    public ?int $limit = 20;                     // Items per page
}

/**
 * Member Compliance Status DTO
 * 
 * Tracks individual member compliance with specific requirements
 * Maps to requirements_compliance table
 * Used for compliance tracking and progress reporting
 * 
 * Database Mapping (requirements_compliance table):
 * - id: Primary key
 * - requirement_id: FK → requirements.id
 * - member_id: FK → members.id
 * - compliance_status: Member's compliance state (complied|not_complied|pending)
 * - submitted_at: When member submitted compliance
 * - created_at/updated_at: Audit timestamps
 * 
 * Compliance Status Values:
 * - 'complied': Member has fulfilled the requirement
 * - 'not_complied': Member has not fulfilled the requirement
 * - 'pending': Requirement still pending for member (default)
 * 
 * @interface
 */
class ComplianceStatusDTO {
    public int $id;                              // Primary key
    public int $memberId;                        // FK to members table
    public int $requirementId;                   // FK to requirements table
    public string $complianceStatus;             // 'complied', 'not_complied', 'pending'
    public string $submittedAt;                  // ISO 8601 timestamp when submitted
    public string $createdAt;                    // ISO 8601 timestamp
    public string $updatedAt;                    // ISO 8601 timestamp
}

/**
 * Compliance Stats Summary DTO
 * 
 * Aggregated compliance statistics for a requirement
 * Shows how many members have complied vs not complied vs pending
 * Used in list views to show requirement impact
 * 
 * @interface
 */
class ComplianceStatsDTO {
    public int $complied;                        // Count of members who have complied
    public int $notComplied;                     // Count of members who have not complied
    public int $pending;                         // Count of members with pending status
    public int $total;                           // Total members (sum of above)
    
    public function getCompliancePercentage(): float {
        if ($this->total === 0) return 0;
        return round(($this->complied / $this->total) * 100, 2);
    }
}

/**
 * Response DTO for Requirement List with Pagination
 * 
 * Used by getRequirements.php API endpoint
 * Contains paginated list of requirements with compliance stats
 * 
 * @interface
 */
class RequirementListResponseDTO {
    public bool $success;
    public array $requirements;                  // Array of RequirementDTO
    public array $pagination;                    // { page, limit, total, pages, hasPrev, hasNext }
}

/**
 * Response DTO for Single Requirement Operations
 * 
 * Used by create/update/delete requirement endpoints
 * Contains the affected requirement and operation result
 * 
 * @interface
 */
class RequirementResponseDTO {
    public bool $success;
    public string $message;
    public ?RequirementDTO $data = null;         // Null if operation failed
    public ?array $errors = null;                // Null if operation succeeded
}

?>
