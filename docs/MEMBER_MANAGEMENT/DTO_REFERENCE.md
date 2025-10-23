# Data Transfer Objects (DTOs) Reference

## Overview

DTOs are TypeScript-style interfaces that define the data contract for all operations. They serve as:
- **Single Source of Truth**: What data is required/optional for each operation
- **Validation Foundation**: MemberValidationHelper validates against DTO specs
- **API Contracts**: Clear request/response shapes
- **Documentation**: Self-documenting code

**Key Principle**: DTOs are pure data structures (no methods) - logic lives in helpers and APIs.

---

## Member DTOs

### Location
- **Interfaces**: `src/DTOs/MemberDTO.php`
- **Validation**: `temp/utils/MemberValidationHelper.php`

### MemberDTO (Complete Profile)

Used for reading member data from database.

```php
class MemberDTO {
    public int $id;                    // Primary key
    public int $userId;                // Foreign key to users
    public string $idNumber;           // School ID (canonical identifier)
    public string $firstName;          // From user
    public string $lastName;           // From user
    public string $email;              // From user
    public ?string $suffix;            // Optional
    public string $birthDate;          // YYYY-MM-DD
    public string $enrollmentDate;     // YYYY-MM-DD
    public string $program;            // BSIT, BSCS, BSIS
    public int $yearLevel;             // 1-4
    public bool $isPaid;               // Payment status
    public ?int $semesterId;           // Optional (future)
    public string $createdAt;          // ISO 8601
    public string $updatedAt;          // ISO 8601
}
```

**Use Cases**: 
- Response from GET member details
- Member profile retrieval
- Member list view

---

### MemberCreateDTO (Registration)

Used when creating/registering a new member.

```php
class MemberCreateDTO {
    public int $userId;                // From user lookup (required)
    public string $idNumber;           // From user lookup (required)
    public string $firstName;          // From user snapshot (required)
    public string $lastName;           // From user snapshot (required)
    public string $email;              // From user snapshot (required)
    public ?string $suffix;            // User input (optional)
    public string $birthDate;          // User input (required, YYYY-MM-DD)
    public string $program;            // User input (required, enum)
    public int $yearLevel;             // User input (required, 1-4)
    public bool $isPaid;               // User input (optional, default: false)
    public ?string $enrollmentDate;    // Default: today
    public ?int $semesterId;           // Optional (future)
}
```

**Validation**: 
- Required: userId, idNumber, firstName, lastName, email, birthDate, program, yearLevel
- Type Checks: int/string/bool
- Enum Validation: program ∈ [BSIT, BSCS, BSIS], yearLevel ∈ [1,2,3,4]
- Format Validation: birthDate matches YYYY-MM-DD, valid date

**Use Cases**: 
- Member registration form submission
- POST /temp/members/createMember.php

---

### MemberUpdateDTO (Partial Updates)

Used when updating existing member data.

```php
class MemberUpdateDTO {
    public ?string $suffix;
    public ?string $birthDate;         // YYYY-MM-DD format
    public ?string $program;           // BSIT, BSCS, BSIS
    public ?int $yearLevel;            // 1-4
    public ?bool $isPaid;
    public ?int $semesterId;
}
```

**Validation**: 
- All fields optional
- If present, must pass same type/format/enum checks as CreateDTO
- Immutable fields NOT included: userId, idNumber, firstName, lastName, email

**Use Cases**: 
- Member profile updates
- Partial data modifications

---

### MemberQueryDTO (Search/Filter)

Used for finding members by criteria.

```php
class MemberQueryDTO {
    public ?string $idNumber;          // Exact match
    public ?string $program;           // Exact match
    public ?int $yearLevel;            // Exact match (1-4)
    public ?bool $isPaid;              // Filter by status
    public ?int $semesterId;           // Filter by semester
}
```

**Validation**: 
- All fields optional
- If present, must pass type/enum checks
- Supports flexible filtering

**Use Cases**: 
- Member search/filtering
- GET member list with filters

---

### MemberRegistrationFormDTO (Form Pre-fill)

Response when user searches by ID number before registration.

```php
class MemberRegistrationFormDTO {
    public int $userId;                // Needed for member creation
    public string $idNumber;           // Canonical identifier
    public string $firstName;          // Auto-fill
    public string $lastName;           // Auto-fill
    public string $email;              // Auto-fill
}
```

**Use Cases**: 
- Response from GET /temp/auth/getUserByIdNumber.php
- Minimal data needed for form auto-fill
- Prevents unnecessary data transfer

---

### UserInfoSnapshotDTO (Immutable)

Captures user info at registration time for audit/integrity.

```php
class UserInfoSnapshotDTO {
    public int $id;                    // User ID at time of snapshot
    public string $idNumber;           // School ID at time
    public string $firstName;          // Name at time
    public string $lastName;           // Name at time
    public string $email;              // Email at time
    public string $capturedAt;         // ISO 8601 timestamp
}
```

**Use Cases**: 
- Internal audit trail
- Data integrity verification
- Historical record of member registration

---

## User DTOs

### Location
- **Interfaces**: `src/DTOs/UserDTO.php`
- **Validation**: (To be created: `temp/utils/UserValidationHelper.php`)

### UserDTO (Complete Profile)

```php
class UserDTO {
    public int $id;
    public string $idNumber;           // Canonical identifier
    public string $email;
    public string $firstName;
    public string $lastName;
    public ?string $suffix;
    public string $role;               // ADMIN or USER
    public string $createdAt;          // ISO 8601
    public string $updatedAt;          // ISO 8601
}
```

---

### UserCreateDTO (User Registration)

```php
class UserCreateDTO {
    public string $idNumber;           // Unique, required
    public string $email;              // Unique, required
    public string $firstName;          // Required
    public string $lastName;           // Required
    public ?string $suffix;            // Optional
    public string $password;           // Hashed, required
    public ?string $role;              // Default: USER
}
```

---

### UserFormAutoFillDTO (Lookup Result)

Minimal data returned when looking up user by ID.

```php
class UserFormAutoFillDTO {
    public int $id;
    public string $idNumber;
    public string $firstName;
    public string $lastName;
    public string $email;
}
```

---

## DTO Usage Pattern

### 1. Frontend Sends Data
```javascript
// JavaScript mirrors DTO structure
const memberData = {
    userId: 1,
    idNumber: "20023045",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    suffix: "Jr.",
    birthDate: "2003-05-15",
    program: "BSIT",
    yearLevel: 3,
    isPaid: true
};

fetch('/temp/members/createMember.php', {
    method: 'POST',
    body: JSON.stringify(memberData)
});
```

### 2. Backend Validates Against DTO
```php
// PHP validates using MemberValidationHelper
$validation = MemberValidationHelper::validateMemberCreateDTO($data);

if (!$validation['valid']) {
    // Return specific validation errors
    return error($validation['errors']);
}
```

### 3. Backend Processes as DTO
```php
// Create member from validated data
$member = [
    'first_name' => $data['firstName'],
    'last_name' => $data['lastName'],
    'id_school_number' => $data['idNumber'],
    // ... etc
];
```

### 4. Backend Returns DTO Structure
```php
// Response follows DTO structure
return [
    'success' => true,
    'data' => [
        'id' => 1,
        'idNumber' => '20023045',
        // ... other DTO fields
    ]
];
```

---

## Key Design Principles

### 1. Separation of Concerns
- **DTOs**: Data structure only
- **Validation**: MemberValidationHelper, UserValidationHelper
- **Logic**: API endpoints (PHP), form handlers (JavaScript)

### 2. Type Safety
- Every DTO field has explicit type
- Validation enforces types
- No type coercion confusion

### 3. Clear Intent
- Different DTOs for different operations (Create vs Update vs Query)
- Field presence indicates requirement
- Optional fields clearly marked with `?`

### 4. No Redundancy
- Single source of truth (DTOs)
- Validation based on DTO definitions
- API contracts derived from DTOs

### 5. Laravel Migration Ready
- DTOs map to Form Requests
- Types support PHP 8+ attributes
- Structure aligns with Laravel conventions

---

## Validation Mapping

Each DTO has validation rules in MemberValidationHelper:

| DTO | Validation Method | Required Fields | Type Checks | Enum Checks |
|-----|------------------|-----------------|------------|------------|
| MemberCreateDTO | validateMemberCreateDTO() | 8 fields | 8 checks | program, yearLevel |
| MemberUpdateDTO | validateMemberUpdateDTO() | 0 fields | 5 checks | program, yearLevel |
| MemberQueryDTO | validateMemberQueryDTO() | 0 fields | 5 checks | program, yearLevel |

---

## API Endpoint DTO Mapping

| Endpoint | Request DTO | Response DTO | Errors |
|----------|------------|-------------|--------|
| POST /temp/members/createMember.php | MemberCreateDTO | MemberDTO | Validation errors |
| GET /temp/auth/getUserByIdNumber.php | - | MemberRegistrationFormDTO | 404 if not found |
| PUT /temp/members/updateMember.php | MemberUpdateDTO | MemberDTO | Validation errors |
| GET /temp/members/searchMembers.php | MemberQueryDTO | MemberDTO[] | Empty if no matches |

---

## No Unnecessary API Calls

**Member Registration Workflow**:
1. **API Call 1**: GET /temp/auth/getUserByIdNumber.php?idNumber=X
   - Returns: MemberRegistrationFormDTO (minimal data)
   - Used to: Auto-fill form, get userId
   
2. **API Call 2**: POST /temp/members/createMember.php
   - Accepts: MemberCreateDTO
   - Returns: MemberDTO (newly created member)

**Total**: 2 API calls per registration
**No redundant lookups or data transfers**
