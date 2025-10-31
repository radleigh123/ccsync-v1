# Requirements Management Implementation Plan

## Database Schema Summary

### `requirements` Table
```
├── id (bigint, PK, auto_increment)
├── name (varchar 255, NOT NULL)
├── description (text, nullable)
├── status (enum: 'open', 'closed', 'archived', default: 'open')
├── requirement_date (date, NOT NULL) - Deadline
├── created_at (timestamp)
└── updated_at (timestamp)
```

### `requirements_compliance` Table
```
├── id (bigint, PK, auto_increment)
├── requirement_id (bigint, FK → requirements.id)
├── member_id (bigint, FK → members.id)
├── compliance_status (enum: 'complied', 'not_complied', 'pending', default: 'pending')
├── submitted_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## Implementation Structure

### 1. Backend DTOs (PHP)
**Location:** `src/DTOs/RequirementDTO.php`

```php
class RequirementDTO {
    // Complete requirement data (read operations)
    public int $id;
    public string $name;
    public ?string $description;
    public string $status;           // 'open', 'closed', 'archived'
    public string $requirementDate;  // YYYY-MM-DD (deadline)
    public string $createdAt;
    public string $updatedAt;
}

class RequirementCreateDTO {
    // For creating new requirements
    public string $name;                    // required
    public ?string $description;            // optional
    public string $requirementDate;         // required, YYYY-MM-DD
    public string $status = 'open';         // default: 'open'
}

class RequirementUpdateDTO {
    // For updating requirements (all fields optional)
    public ?string $name;
    public ?string $description;
    public ?string $status;
    public ?string $requirementDate;
}

class RequirementQueryDTO {
    // For filtering/searching requirements
    public ?string $status;                 // Filter by status
    public ?string $name;                   // Search by name
}

class ComplianceStatusDTO {
    // For compliance tracking per member
    public int $memberId;
    public int $requirementId;
    public string $complianceStatus;        // 'complied', 'not_complied', 'pending'
    public string $submittedAt;
}
```

### 2. Backend Validation Helper
**Location:** `src/utils/RequirementValidationHelper.php`

Follow MemberValidationHelper pattern:
- Validate RequirementCreateDTO against business rules
- Validate RequirementUpdateDTO for partial updates
- Check date format (YYYY-MM-DD)
- Check enum values (status: open|closed|archived)
- Return structured error responses

### 3. Backend API Endpoints

#### Endpoint 1: List Requirements with Pagination
**File:** `ccsync-api-plain/requirement/getRequirements.php`
- **Method:** GET
- **Query Params:** `?page=1&limit=20&status=open`
- **Returns:** Paginated list with compliance stats per requirement
- **Pagination:** Page number + total count

#### Endpoint 2: Create Requirement
**File:** `ccsync-api-plain/requirement/createRequirement.php`
- **Method:** POST
- **Body:** RequirementCreateDTO JSON
- **Auth:** Bearer token (admin only)
- **Returns:** Created RequirementDTO
- **Errors:** 400 (validation), 403 (unauthorized), 500 (server error)

#### Endpoint 3: Update Requirement
**File:** `ccsync-api-plain/requirement/updateRequirement.php`
- **Method:** PUT
- **Query:** `?id=X`
- **Body:** RequirementUpdateDTO JSON
- **Returns:** Updated RequirementDTO
- **Errors:** 404 (not found), 400 (validation), 403 (unauthorized)

#### Endpoint 4: Delete Requirement
**File:** `ccsync-api-plain/requirement/deleteRequirement.php`
- **Method:** DELETE
- **Query:** `?id=X`
- **Returns:** Success message
- **Errors:** 404 (not found), 403 (unauthorized)

#### Endpoint 5: Get Member Compliance Status
**File:** `ccsync-api-plain/requirement/getMemberCompliance.php`
- **Method:** GET
- **Query:** `?memberId=X&requirementId=Y` (optional filter)
- **Returns:** Array of ComplianceStatusDTO for member
- **Use:** Show member's compliance progress

### 4. Frontend Structure

#### Files to Create:
1. **`src/js/pages/home/requirement/viewRequirement.js`**
   - List view with pagination (20 per page)
   - Status filter (open/closed/archived)
   - Search by name
   - Shimmer loading with table skeleton
   - Error handling

2. **`src/js/pages/home/requirement/addRequirement.js`**
   - Form with validation (name, description, date, status)
   - Inline error messages via FormValidator
   - Confirmation modal before submit
   - Success/error response modals
   - Clear form after success

3. **`src/pages/home/requirement/view-requirement.html`**
   - Table with columns: Name, Description, Deadline, Status
   - Status badges (open: blue, closed: gray, archived: muted)
   - Pagination controls (top + bottom)
   - Search bar
   - "Add Requirement" button
   - Shimmer table skeleton

4. **`src/pages/home/requirement/add-requirement.html`**
   - Form fields:
     - Name (text input, required, data-validate="required|min:3|max:255")
     - Description (textarea, optional)
     - Requirement Date (date input, required, data-validate="required|date")
     - Status (select: open/closed/archived, default: open)
   - Submit button
   - Response modals (success/error)

5. **`src/scss/pages/home/requirement/addRequirement.scss`**
   - Match form styling from registerMember
   - Date picker styling
   - Status badge colors

### 5. Reusable Components Used

#### errorSuccessModal
```javascript
// Success
responseModal.showSuccess(
    'Requirement Created!',
    'The requirement has been added successfully.'
);

// Error
responseModal.showError(
    'Creation Failed',
    'Could not create requirement',
    error.message
);
```

#### confirmationModal
```javascript
confirmationModal.show(
    'Confirm Creation',
    'Please review the requirement details before confirming.',
    {
        details: `<div>Name: ${name}</div>...`,
        onYes: () => submitRequirement(),
        onNo: () => { /* cancel */ },
        yesText: 'Create Requirement',
        noText: 'Cancel'
    }
);
```

#### FormValidator
```javascript
// In HTML: data-validate="required|min:3|max:255"
// Auto-validates on blur, input, change
formValidator = new FormValidator(form);

if (!formValidator.validateForm()) {
    // Shows inline errors, doesn't submit
    return;
}
```

#### shimmerLoader
```javascript
// Show loading
shimmerLoader.show("#shimmerTable");

// Hide with fade
shimmerLoader.hide("#shimmerTable", 600);
```

### 6. Data Flow Patterns

#### List View (viewRequirement.js)
```
Page Load
    ↓
1. Show shimmer table
2. Fetch /getRequirements.php?page=1&status=all
3. Parse response + pagination data
4. Apply filters (status, search)
5. Display in table
6. Hide shimmer (600ms fade)
7. Show data table
```

#### Create View (addRequirement.js)
```
Form Submit
    ↓
1. Validate with FormValidator (inline errors)
2. Show confirmation modal with details
3. User confirms
4. Show loading state
5. POST /createRequirement.php with RequirementCreateDTO
6. On success:
   - Show success modal
   - Clear form
   - Redirect to view or stay
7. On error:
   - Show error modal with details
   - Keep form filled
```

#### Filtering Pattern (viewRequirement.js)
```
Filter State:
- searchText = ""           // Tier 1: Text search
- selectedStatus = "all"    // Tier 2: Status filter

applyAllFilters():
    Filter by searchText (name search)
    Filter by selectedStatus (status dropdown)
    Display filtered results
    Update pagination
```

### 7. Response Structure (JSON)

#### GET /getRequirements.php Response
```json
{
    "success": true,
    "requirements": [
        {
            "id": 1,
            "name": "Submit Attendance Records",
            "description": "Members must submit proof of attendance...",
            "status": "open",
            "requirement_date": "2025-12-31",
            "created_at": "2025-10-01T10:00:00Z",
            "updated_at": "2025-10-01T10:00:00Z",
            "compliance_stats": {
                "complied": 5,
                "not_complied": 2,
                "pending": 3
            }
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 45,
        "pages": 3,
        "hasPrev": false,
        "hasNext": true
    }
}
```

#### POST /createRequirement.php Response
```json
{
    "success": true,
    "message": "Requirement created successfully",
    "data": {
        "id": 1,
        "name": "Submit Attendance Records",
        "description": "...",
        "status": "open",
        "requirement_date": "2025-12-31",
        "created_at": "2025-10-01T10:00:00Z",
        "updated_at": "2025-10-01T10:00:00Z"
    }
}
```

#### Error Response (400 Validation)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "name": "Required",
        "requirement_date": "Invalid date format"
    }
}
```

## Implementation Checklist

### Backend
- [ ] Create RequirementDTO.php with all DTOs
- [ ] Create RequirementValidationHelper.php
- [ ] Create getRequirements.php endpoint
- [ ] Create createRequirement.php endpoint
- [ ] Create updateRequirement.php endpoint
- [ ] Create deleteRequirement.php endpoint
- [ ] Create getMemberCompliance.php endpoint

### Frontend
- [ ] Create viewRequirement.js with pagination + filtering
- [ ] Create addRequirement.js with validation + modals
- [ ] Create view-requirement.html with shimmer table
- [ ] Create add-requirement.html with form
- [ ] Create addRequirement.scss styling
- [ ] Add sidebar navigation entries
- [ ] Test all CRUD operations
- [ ] Test error handling
- [ ] Test validation messages
- [ ] Test pagination and filtering

## Notes

1. **Compliance Tracking**: Requirements_compliance table tracks individual member compliance
2. **Status Lifecycle**: open → closed → archived
3. **Pagination**: Same as members (20 per page)
4. **Filtering**: Status filter + text search (like members)
5. **Date Format**: YYYY-MM-DD for requirement_date and requirement_date in forms
6. **Error Handling**: Same pattern as members (400, 403, 404, 500)
7. **Validation**: Server-side only (no client-side validation besides inline form validation)

---

## Confirmation Questions

1. ✅ Should we include compliance tracking UI in member view page?
2. ✅ Should requirements support update/edit after creation?
3. ✅ Should deletion be soft-delete (status → archived) or hard-delete?
4. ✅ Should admin-only operations require Bearer token auth?
5. ✅ Should we add requirement_date filtering (date range)?
