# Developer Quick Reference - CCSync DTOs & Validation

**Version:** 1.0  
**Last Updated:** October 21, 2025  
**For:** CCSync Development Team

---

## QUICK LINKS

| Module | DTO File | Validation File | Status |
|--------|----------|-----------------|--------|
| Member | `src/DTOs/MemberDTO.php` | `temp/utils/MemberValidationHelper.php` | ✅ Implemented |
| Event | `src/DTOs/EventDTO.php` | `temp/utils/EventValidationHelper.php` | ✅ Implemented |
| Officer | `src/DTOs/OfficerDTO.php` | `temp/utils/OfficerValidationHelper.php` | ✅ Implemented |
| Requirement | `src/DTOs/RequirementDTO.php` | `temp/utils/RequirementValidationHelper.php` | ✅ Implemented |
| User | `src/DTOs/UserDTO.php` | `temp/utils/UserValidationHelper.php` | ✅ Implemented |

---

## USING DTOs IN YOUR CODE

### Step 1: Include the Validation Helper
```php
require_once __DIR__ . '/../../utils/MemberValidationHelper.php';
```

### Step 2: Get JSON from Request
```php
$data = json_decode(file_get_contents("php://input"), true);
```

### Step 3: Validate Against DTO
```php
$validation = MemberValidationHelper::validateMemberCreateDTO($data);

if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validation['errors']
    ]);
    exit;
}
```

### Step 4: Use Validated Data
```php
// Data is now guaranteed to match DTO contract
$memberId = $data['memberId'];      // int (guaranteed)
$firstName = $data['firstName'];    // string (guaranteed)
// ... proceed with database operations
```

---

## VALIDATION METHODS BY MODULE

### Member Validation
```php
MemberValidationHelper::validateMemberCreateDTO($data)
MemberValidationHelper::validateMemberUpdateDTO($data)
MemberValidationHelper::validateMemberQueryDTO($data)
```

### Event Validation
```php
EventValidationHelper::validateEventCreateDTO($data)
EventValidationHelper::validateEventUpdateDTO($data, $existing)
EventValidationHelper::validateEventQueryDTO($data)
EventValidationHelper::validateEventParticipantDTO($data)
EventValidationHelper::validateEventActivityPointDTO($data)
```

### Officer Validation
```php
OfficerValidationHelper::validateOfficerCreateDTO($data)
OfficerValidationHelper::validateOfficerUpdateDTO($data, $existing)
OfficerValidationHelper::validateOfficerQueryDTO($data)
```

### Requirement Validation
```php
RequirementValidationHelper::validateRequirementCreateDTO($data)
RequirementValidationHelper::validateRequirementUpdateDTO($data)
RequirementValidationHelper::validateRequirementQueryDTO($data)
RequirementValidationHelper::validateMemberRequirementDTO($data)
RequirementValidationHelper::validateRequirementFulfillmentDTO($data)
```

### User Validation
```php
UserValidationHelper::validateUserRegisterDTO($data)
UserValidationHelper::validateUserCreateDTO($data)
UserValidationHelper::validateUserUpdateDTO($data)
UserValidationHelper::validateUserPasswordDTO($data)
UserValidationHelper::validateUserQueryDTO($data)
UserValidationHelper::validatePasswordStrength($password)
```

---

## COMMON DTO FIELDS

### Timestamps (Standard Across All DTOs)
```php
public string $createdAt;           // ISO 8601: "2025-10-21T14:30:00Z"
public string $updatedAt;           // ISO 8601: "2025-10-21T14:30:00Z"
```

### Status Fields
```
Member:       (no status field)
Event:        'active', 'cancelled', 'completed'
Officer:      'current', 'former'
Requirement:  (no status field, but member_requirement has: 'Not Started', 'In Progress', 'Completed', 'Failed')
User:         (no status field)
```

### Date Fields (Always YYYY-MM-DD)
```php
public string $startDate;           // "2025-10-21"
public ?string $endDate;            // "2025-12-21" or null
public string $birthDate;           // "2003-05-15"
```

### ID Fields (Always Positive Integers)
```php
public int $id;                     // Primary key: > 0
public int $userId;                 // Foreign key: > 0
public int $memberId;               // Foreign key: > 0
public int $eventId;                // Foreign key: > 0
public int $requirement Id;         // Foreign key: > 0
```

---

## VALIDATION CONSTANTS BY MODULE

### Lengths (Characters)
```
Member ID:           N/A (not in member data)
User ID Number:      5-20
First Name:          2-50
Last Name:           2-50
Suffix:              Max 20
Event Title:         3-255
Event Description:   10-5000
Event Location:      3-255
Requirement Title:   3-100
Requirement Desc:    10-500
```

### Enums
```
Event Status:        ['active', 'cancelled', 'completed']
Event Participant:   ['attended', 'absent', 'pending']
Officer Status:      ['current', 'former']
Officer Position:    ['President', 'VP', 'Secretary', 'Treasurer', 'Auditor', 'PIO']
Requirement Type:    ['attendance', 'service_hours', 'activity_points', 'payment', 'custom']
Member Requirement:  ['Not Started', 'In Progress', 'Completed', 'Failed']
User Role:           ['student', 'officer', 'admin']
```

### Numeric Ranges
```
Year Level:          1-4
Event Capacity:      > 0 (or null for unlimited)
Officer Member ID:   > 0
Requirement Target:  > 0
Activity Points:     > 0
Password Length:     Minimum 8
```

---

## PASSWORD VALIDATION

**Must Include ALL of these:**
1. ✓ Minimum 8 characters
2. ✓ At least one UPPERCASE letter (A-Z)
3. ✓ At least one lowercase letter (a-z)
4. ✓ At least one number (0-9)
5. ✓ At least one special character (!@#$%^&*)

**Example valid password:**
- `MyPassword123!`
- `Secure@Pass2025`
- `C0mplex#Pwd`

**Example invalid passwords:**
- `password` - Missing uppercase, number, special char
- `Password1` - Missing special character
- `Pass@1` - Too short
- `PASSWORD123!` - Missing lowercase

**Checking in Code:**
```php
$result = UserValidationHelper::validatePasswordStrength('MyPassword123!');
if ($result['valid']) {
    echo "Password is strong";
} else {
    echo "Error: " . $result['message'];
}
```

---

## ERROR RESPONSE FORMAT

**All validation errors follow this format:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName1": "Error message for field 1",
    "fieldName2": "Error message for field 2"
  }
}
```

**HTTP Status Codes:**
- `400` - Validation failed (bad request)
- `404` - Resource not found
- `409` - Conflict (e.g., duplicate entry)
- `500` - Server error

---

## SUCCESS RESPONSE FORMAT

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

---

## CREATE WORKFLOW EXAMPLE

**Registering a Member:**

```php
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/MemberValidationHelper.php';

// 1. Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

// 2. Validate
$validation = MemberValidationHelper::validateMemberCreateDTO($data);
if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validation['errors']
    ]);
    exit;
}

// 3. Now data is guaranteed valid
try {
    // 4. Database operations
    $sql = "INSERT INTO members (user_id, birth_date, program, year_level, is_paid) 
            VALUES (:userId, :birthDate, :program, :yearLevel, :isPaid)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':userId' => $data['userId'],
        ':birthDate' => $data['birthDate'],
        ':program' => $data['program'],
        ':yearLevel' => $data['yearLevel'],
        ':isPaid' => $data['isPaid']
    ]);

    // 5. Return success
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Member registered successfully',
        'data' => ['id' => $conn->lastInsertId()]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
```

---

## UPDATE WORKFLOW EXAMPLE

**Updating an Event:**

```php
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/EventValidationHelper.php';

$eventId = $_GET['id'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);

// Get existing event for constraint validation
$existingEvent = /* fetch from DB */;

// Validate (pass existing event for constraint checking)
$validation = EventValidationHelper::validateEventUpdateDTO($data, $existingEvent);
if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $validation['errors']
    ]);
    exit;
}

// Update only provided fields
$updates = [];
$params = [];
foreach ($data as $key => $value) {
    $updates[] = "$key = :$key";
    $params[":$key"] = $value;
}
$params[':id'] = $eventId;

$sql = "UPDATE events SET " . implode(', ', $updates) . " WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Event updated successfully'
]);
?>
```

---

## SEARCH/QUERY WORKFLOW EXAMPLE

**Searching Members:**

```php
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/MemberValidationHelper.php';

$query = $_GET;  // Get query parameters

// Validate search criteria
$validation = MemberValidationHelper::validateMemberQueryDTO($query);
if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid search criteria',
        'errors' => $validation['errors']
    ]);
    exit;
}

// Build dynamic SQL
$sql = "SELECT * FROM members WHERE 1=1";
$params = [];

if (isset($query['program'])) {
    $sql .= " AND program = :program";
    $params[':program'] = $query['program'];
}

if (isset($query['yearLevel'])) {
    $sql .= " AND year_level = :yearLevel";
    $params[':yearLevel'] = $query['yearLevel'];
}

if (isset($query['isPaid'])) {
    $sql .= " AND is_paid = :isPaid";
    $params[':isPaid'] = $query['isPaid'];
}

$stmt = $conn->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'data' => $results,
    'count' => count($results)
]);
?>
```

---

## TESTING YOUR VALIDATION

**Using curl to test validation:**

```bash
# Test create with valid data
curl -X POST http://localhost/temp/members/createMember.php \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "idNumber": "20023045",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com",
    "birthDate": "2003-05-15",
    "program": "BSIT",
    "yearLevel": 3
  }'

# Test create with invalid data (missing birthDate)
curl -X POST http://localhost/temp/members/createMember.php \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "idNumber": "20023045",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com",
    "program": "BSIT",
    "yearLevel": 3
  }'
```

---

## COMMON MISTAKES TO AVOID

### ❌ Don't: Frontend Validation
```javascript
// WRONG: Don't do this
if (form.title.length < 3) {
    alert("Title too short");
    return false;
}
```

### ✅ Do: Server-Side Validation Only
```php
// CORRECT: Always validate server-side
$validation = EventValidationHelper::validateEventCreateDTO($data);
if (!$validation['valid']) {
    return errorResponse($validation['errors']);
}
```

### ❌ Don't: Manual Type Checking
```php
// WRONG: Don't write this
if (is_int($data['userId']) && $data['userId'] > 0) {
    // Process...
}
```

### ✅ Do: Use Validation Helpers
```php
// CORRECT: Use the helper
$validation = MemberValidationHelper::validateMemberCreateDTO($data);
if ($validation['valid']) {
    // Data is guaranteed to be correct type
}
```

### ❌ Don't: Multiple Validation Checks
```php
// WRONG: Multiple API calls for validation
const response1 = await fetch('/api/check-duplicate');
const response2 = await fetch('/api/validate-email');
const response3 = await fetch('/api/create');
```

### ✅ Do: Single Validation Call
```php
// CORRECT: Single validation, then create
$validation = EventValidationHelper::validateEventCreateDTO($data);
if ($validation['valid']) {
    // Create event in single operation
}
```

---

## DOCUMENTATION LOCATIONS

| Document | Path | Purpose |
|----------|------|---------|
| Phase 2 Summary | `docs/PHASE_2_COMPLETION_SUMMARY.md` | Overall progress and status |
| DTOs & Validation | `docs/MANAGEMENT_MODULES/DTOs_AND_VALIDATION.md` | Complete DTO reference |
| Member Implementation | `docs/MEMBER_MANAGEMENT/IMPLEMENTATION.md` | Member workflow details |
| Code Review | `docs/MEMBER_MANAGEMENT/CODE_REVIEW.md` | Architecture review |
| Validation Test Cases | `docs/MEMBER_MANAGEMENT/VALIDATION_TEST_CASES.md` | All test scenarios |

---

## GETTING HELP

### Questions About:
- **DTOs** - See `src/DTOs/*.php` (well documented)
- **Validation** - See `temp/utils/*ValidationHelper.php` (with examples)
- **Workflows** - See this document (Quick Reference)
- **Architecture** - See `docs/PHASE_2_COMPLETION_SUMMARY.md`
- **Examples** - See section above (Workflow Examples)

### Reporting Issues:
1. Check if already validated (look for validation helper)
2. Check constants (allowed values, constraints)
3. Check error message (tells you what's wrong)
4. Refer to validation methods for exact rules

---

## NEXT STEPS

Phase 3: Implement API endpoints using these DTOs and validation helpers.

Each API endpoint should:
1. Include appropriate validation helper
2. Validate incoming data
3. Return standardized error responses
4. Return standardized success responses

All endpoints will follow the same proven pattern.

