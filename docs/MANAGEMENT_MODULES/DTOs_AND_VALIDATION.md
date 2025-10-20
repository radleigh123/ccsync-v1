# Event, Officer, & Requirement Management - DTOs & Validation

**Date:** October 21, 2025  
**Status:** PHASE 2 COMPLETE - ALL CORE DTos IMPLEMENTED  
**Version:** 1.0

---

## 1. OVERVIEW

This phase extends the DTO-driven architecture to three additional management modules:

1. **Event Management** - Organization events and member participation
2. **Officer Management** - Officer positions and term tracking  
3. **Requirement Management** - Membership requirements and progress tracking

Each module follows the same architectural pattern established by the Member Management phase:
- Pure data structures (DTOs) as single source of truth
- Centralized server-side validation helpers
- No frontend validation (all validation server-side)
- Framework-agnostic for future Laravel migration

---

## 2. EVENT MANAGEMENT DTÓS

### 2.1 Files Created

**DTOs:**
- `src/DTOs/EventDTO.php`
  - `EventDTO` - Complete event profile
  - `EventCreateDTO` - Event creation data
  - `EventUpdateDTO` - Event update data (partial)
  - `EventQueryDTO` - Event search/filter criteria
  - `EventParticipantDTO` - Event attendance tracking
  - `EventResponseDTO` - API response format
  - `EventActivityPointDTO` - Activity points award

**Validation:**
- `temp/utils/EventValidationHelper.php`
  - `validateEventCreateDTO()` - Validate event creation
  - `validateEventUpdateDTO()` - Validate event updates
  - `validateEventQueryDTO()` - Validate search parameters
  - `validateEventParticipantDTO()` - Validate participant data
  - `validateEventActivityPointDTO()` - Validate point awards

### 2.2 EventDTO - Complete Event Profile

```php
class EventDTO {
    public int $id;                    // Primary key
    public string $title;              // Event name
    public string $description;        // Event details
    public string $startDate;          // YYYY-MM-DD (future date)
    public ?string $endDate;           // YYYY-MM-DD (optional, >= startDate)
    public string $location;           // Venue/location
    public ?int $capacity;             // Max attendees (optional, unlimited if null)
    public int $attendees;             // Current attendee count (read-only)
    public string $status;             // active, cancelled, completed
    public int $createdBy;             // Creator user ID
    public string $createdAt;          // ISO 8601 timestamp
    public string $updatedAt;          // ISO 8601 timestamp
}
```

**Field Mapping:**
| Field | Type | Usage | Notes |
|-------|------|-------|-------|
| title | string | User input | Min 3, max 255 characters |
| description | string | User input | Min 10, max 5000 characters |
| startDate | string | User input | Future date, YYYY-MM-DD format |
| endDate | string\|null | User input | Optional, must be >= startDate |
| location | string | User input | Min 3, max 255 characters |
| capacity | int\|null | User input | Optional, positive integer |
| attendees | int | Read-only | Current registered count |
| status | string | System | active, cancelled, completed |

### 2.3 EventCreateDTO - Event Creation

```php
class EventCreateDTO {
    public string $title;              // Required
    public string $description;        // Required
    public string $startDate;          // Required, future date
    public ?string $endDate;           // Optional, >= startDate
    public string $location;           // Required
    public ?int $capacity;             // Optional, > 0
}
```

**Validation Rules:**
- **title:** Required, 3-255 characters
- **description:** Required, 10-5000 characters
- **startDate:** Required, YYYY-MM-DD format, must be future date
- **endDate:** Optional, YYYY-MM-DD format, if provided must be >= startDate
- **location:** Required, 3-255 characters
- **capacity:** Optional, must be positive integer or null

**Example Request:**
```json
{
  "title": "Annual PSITS Meeting 2025",
  "description": "Annual general meeting for all members to discuss organizational plans and achievements for 2025",
  "startDate": "2025-11-15",
  "endDate": "2025-11-15",
  "location": "Auditorium, Building A",
  "capacity": 200
}
```

### 2.4 EventUpdateDTO - Event Updates

```php
class EventUpdateDTO {
    public ?string $title;             // Optional
    public ?string $description;       // Optional
    public ?string $startDate;         // Optional
    public ?string $endDate;           // Optional
    public ?string $location;          // Optional
    public ?int $capacity;             // Optional
    public ?string $status;            // Optional
}
```

**Constraints:**
- startDate cannot be changed to past date
- endDate must be >= startDate (if both provided)
- status can only transition to valid states (active → cancelled, active → completed)
- capacity cannot be reduced below current attendees

### 2.5 EventParticipantDTO - Attendance Tracking

```php
class EventParticipantDTO {
    public int $id;                    // Primary key
    public int $eventId;               // FK to events
    public int $memberId;              // FK to members
    public string $status;             // attended, absent, pending
    public ?string $feedback;          // Optional member feedback
    public bool $hasPoints;            // Whether earned activity points
    public int $pointsEarned;          // Activity points earned
    public string $registeredAt;       // ISO 8601 timestamp
    public string $updatedAt;          // ISO 8601 timestamp
}
```

**Allowed Statuses:**
- `attended` - Member attended the event
- `absent` - Member did not attend
- `pending` - For future events (member registered but event not occurred)

---

## 3. OFFICER MANAGEMENT DTOs

### 3.1 Files Created

**DTOs:**
- `src/DTOs/OfficerDTO.php`
  - `OfficerDTO` - Complete officer profile
  - `OfficerCreateDTO` - Officer appointment data
  - `OfficerUpdateDTO` - Officer update data
  - `OfficerQueryDTO` - Officer search criteria
  - `OfficerTermDTO` - Officer term/tenure history

**Validation:**
- `temp/utils/OfficerValidationHelper.php`
  - `validateOfficerCreateDTO()` - Validate appointments
  - `validateOfficerUpdateDTO()` - Validate updates
  - `validateOfficerQueryDTO()` - Validate searches

### 3.2 OfficerDTO - Officer Profile

```php
class OfficerDTO {
    public int $id;                    // Primary key
    public int $memberId;              // FK to members
    public string $memberName;         // Member's full name (join)
    public string $position;           // Officer position
    public string $startDate;          // YYYY-MM-DD
    public ?string $endDate;           // YYYY-MM-DD (null if current)
    public string $status;             // current, former
    public string $createdAt;          // ISO 8601 timestamp
    public string $updatedAt;          // ISO 8601 timestamp
}
```

### 3.3 Allowed Officer Positions

```php
const ALLOWED_POSITIONS = ['President', 'VP', 'Secretary', 'Treasurer', 'Auditor', 'PIO'];
```

**Position Hierarchy:**
1. **President** - Organization leader
2. **VP** - Vice President, assists president
3. **Secretary** - Maintains records and minutes
4. **Treasurer** - Financial management
5. **Auditor** - Financial auditing
6. **PIO** - Public Information Officer

### 3.4 OfficerCreateDTO - Appointment

```php
class OfficerCreateDTO {
    public int $memberId;              // Required, must exist
    public string $position;           // Required, enum
    public string $startDate;          // Required, YYYY-MM-DD
    public ?string $endDate;           // Optional, if replacing outgoing
}
```

**Example Request:**
```json
{
  "memberId": 5,
  "position": "President",
  "startDate": "2025-10-21",
  "endDate": null
}
```

### 3.5 OfficerTermDTO - Term History

```php
class OfficerTermDTO {
    public int $id;                    // Primary key
    public int $officerId;             // FK to officers
    public string $position;           // Position held
    public int $memberId;              // FK to members
    public string $memberName;         // Member name at time of term
    public string $startDate;          // YYYY-MM-DD
    public ?string $endDate;           // YYYY-MM-DD (null if current)
    public int $termOrder;             // Sequential order (1 = first holder)
    public string $status;             // current, former
    public int $yearsInOffice;         // Calculated tenure
    public string $createdAt;          // ISO 8601 timestamp
}
```

---

## 4. REQUIREMENT MANAGEMENT DTOs

### 4.1 Files Created

**DTOs:**
- `src/DTOs/RequirementDTO.php`
  - `RequirementDTO` - Complete requirement profile
  - `RequirementCreateDTO` - Requirement creation data
  - `RequirementUpdateDTO` - Requirement update data
  - `RequirementQueryDTO` - Search criteria
  - `MemberRequirementDTO` - Member progress on requirement
  - `RequirementProgressDTO` - Member overall progress
  - `RequirementFulfillmentDTO` - Fulfillment event tracking

**Validation:**
- `temp/utils/RequirementValidationHelper.php`
  - `validateRequirementCreateDTO()` - Validate requirement creation
  - `validateRequirementUpdateDTO()` - Validate updates
  - `validateRequirementQueryDTO()` - Validate searches
  - `validateMemberRequirementDTO()` - Validate member progress
  - `validateRequirementFulfillmentDTO()` - Validate fulfillment

### 4.2 RequirementDTO - Complete Profile

```php
class RequirementDTO {
    public int $id;                    // Primary key
    public string $title;              // Requirement name
    public string $description;        // Detailed description
    public string $type;               // attendance, service_hours, activity_points, payment, custom
    public float $targetValue;         // Goal/threshold value
    public string $unit;               // %, hours, points, pesos, etc.
    public bool $isActive;             // Currently enforced?
    public ?int $semesterId;           // Optional semester scope
    public string $createdAt;          // ISO 8601 timestamp
    public string $updatedAt;          // ISO 8601 timestamp
}
```

### 4.3 Requirement Types

```php
const ALLOWED_TYPES = ['attendance', 'service_hours', 'activity_points', 'payment', 'custom'];
```

**Type Descriptions:**

| Type | Description | Target | Unit | Example |
|------|-------------|--------|------|---------|
| attendance | Event/activity attendance quota | Percentage | % | 80% attendance required |
| service_hours | Hours volunteered | Number | hours | 10 hours minimum |
| activity_points | Points earned from activities | Number | points | 50 points needed |
| payment | Membership dues | Amount | pesos | 500 pesos |
| custom | Custom requirement | Variable | custom | Custom deliverable |

### 4.4 MemberRequirementDTO - Progress Tracking

```php
class MemberRequirementDTO {
    public int $memberId;              // FK to members
    public int $requirementId;         // FK to requirements
    public string $memberName;         // Member's full name
    public string $requirementTitle;   // Requirement title
    public float $currentValue;        // Current progress
    public float $targetValue;         // Target value
    public float $percentProgress;     // % (current / target * 100)
    public string $status;             // Not Started, In Progress, Completed, Failed
    public bool $isMet;                // currentValue >= targetValue
    public string $updatedAt;          // ISO 8601 timestamp
}
```

**Status Values:**
- `Not Started` - Member has not made any progress
- `In Progress` - Member has started but not completed
- `Completed` - Member has met the requirement
- `Failed` - Member did not meet requirement by deadline

### 4.5 RequirementProgressDTO - Overall Summary

```php
class RequirementProgressDTO {
    public int $memberId;              // Member ID
    public string $memberName;         // Member's full name
    public int $totalRequirements;     // Total active requirements
    public int $metRequirements;       // Number met
    public int $inProgressRequirements;// Number in progress
    public int $notMetRequirements;    // Number not met
    public float $overallProgress;     // % overall (metRequirements / totalRequirements * 100)
    public bool $allMetRequirements;   // All met?
    public array $requirementDetails;  // Array of MemberRequirementDTO
    public string $updatedAt;          // Last calculation time
}
```

### 4.6 RequirementCreateDTO - Creation

```php
class RequirementCreateDTO {
    public string $title;              // Required, 3-100 chars
    public string $description;        // Required, 10-500 chars
    public string $type;               // Required, enum
    public float $targetValue;         // Required, > 0
    public string $unit;               // Required, string
    public ?bool $isActive;            // Optional, default: true
    public ?int $semesterId;           // Optional, null = all semesters
}
```

**Example Requests:**

```json
{
  "title": "Attendance Requirement",
  "description": "Members must attend at least 80% of organization meetings and events throughout the semester",
  "type": "attendance",
  "targetValue": 80,
  "unit": "%",
  "isActive": true,
  "semesterId": null
}
```

```json
{
  "title": "Membership Dues",
  "description": "Annual membership fee for the organization",
  "type": "payment",
  "targetValue": 500,
  "unit": "pesos",
  "isActive": true,
  "semesterId": 1
}
```

```json
{
  "title": "Activity Points",
  "description": "Members must earn at least 50 activity points through participation in events and activities",
  "type": "activity_points",
  "targetValue": 50,
  "unit": "points",
  "isActive": true,
  "semesterId": null
}
```

### 4.7 RequirementFulfillmentDTO - Fulfillment Tracking

```php
class RequirementFulfillmentDTO {
    public int $id;                    // Primary key
    public int $memberId;              // FK to members
    public int $requirementId;         // FK to requirements
    public float $valueAdded;          // Progress amount
    public string $reason;             // attendance_event, activity_points_earned, manual_adjustment, payment_received
    public ?string $notes;             // Optional admin notes
    public int $recordedBy;            // Admin/officer user ID
    public string $recordedAt;         // ISO 8601 timestamp
}
```

**Fulfillment Reasons:**
- `attendance_event` - Attended an event
- `activity_points_earned` - Earned points from activity
- `manual_adjustment` - Manual admin adjustment
- `payment_received` - Payment received
- `points_award` - Officer awarded points
- `exemption` - Requirement waived/exempted

---

## 5. VALIDATION HELPER REFERENCE

### 5.1 EventValidationHelper

**Constants:**
```php
const ALLOWED_STATUSES = ['active', 'cancelled', 'completed'];
const ALLOWED_PARTICIPANT_STATUSES = ['attended', 'absent', 'pending'];
const ALLOWED_POINT_REASONS = ['attended', 'officer_conducted', 'helped_organize'];

const TITLE_MIN = 3;
const TITLE_MAX = 255;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 5000;
const LOCATION_MIN = 3;
const LOCATION_MAX = 255;
```

**Validation Methods:**
```php
EventValidationHelper::validateEventCreateDTO(array $data): array
EventValidationHelper::validateEventUpdateDTO(array $data, ?array $existingEvent = null): array
EventValidationHelper::validateEventQueryDTO(array $data): array
EventValidationHelper::validateEventParticipantDTO(array $data): array
EventValidationHelper::validateEventActivityPointDTO(array $data): array
```

### 5.2 OfficerValidationHelper

**Constants:**
```php
const ALLOWED_POSITIONS = ['President', 'VP', 'Secretary', 'Treasurer', 'Auditor', 'PIO'];
const ALLOWED_STATUSES = ['current', 'former'];
```

**Validation Methods:**
```php
OfficerValidationHelper::validateOfficerCreateDTO(array $data): array
OfficerValidationHelper::validateOfficerUpdateDTO(array $data, ?array $existingOfficer = null): array
OfficerValidationHelper::validateOfficerQueryDTO(array $data): array
```

### 5.3 RequirementValidationHelper

**Constants:**
```php
const ALLOWED_TYPES = ['attendance', 'service_hours', 'activity_points', 'payment', 'custom'];
const ALLOWED_MEMBER_STATUSES = ['Not Started', 'In Progress', 'Completed', 'Failed'];

const TITLE_MIN = 3;
const TITLE_MAX = 100;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 500;
```

**Validation Methods:**
```php
RequirementValidationHelper::validateRequirementCreateDTO(array $data): array
RequirementValidationHelper::validateRequirementUpdateDTO(array $data): array
RequirementValidationHelper::validateRequirementQueryDTO(array $data): array
RequirementValidationHelper::validateMemberRequirementDTO(array $data): array
RequirementValidationHelper::validateRequirementFulfillmentDTO(array $data): array
```

---

## 6. ERROR HANDLING

All validation helpers return consistent error format:

**Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "title must be between 3 and 255 characters",
    "startDate": "startDate must be a future date"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Event not found"
}
```

**Conflict (409):**
```json
{
  "success": false,
  "message": "Member is already an officer"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 10,
    "title": "Annual Meeting",
    "startDate": "2025-11-15"
  }
}
```

---

## 7. DATABASE SCHEMA RECOMMENDATIONS

### Events Table
```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255) NOT NULL,
    capacity INT,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE event_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    member_id INT NOT NULL,
    status ENUM('attended', 'absent', 'pending') DEFAULT 'pending',
    feedback TEXT,
    has_points BOOLEAN DEFAULT FALSE,
    points_earned INT DEFAULT 0,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    UNIQUE KEY unique_participation (event_id, member_id)
);
```

### Officers Table
```sql
CREATE TABLE officers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    position VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('current', 'former') DEFAULT 'current',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    UNIQUE KEY unique_current_position (position, status) USING BTREE
);
```

### Requirements Table
```sql
CREATE TABLE requirements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('attendance', 'service_hours', 'activity_points', 'payment', 'custom') NOT NULL,
    target_value FLOAT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    semester_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id)
);

CREATE TABLE member_requirements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    requirement_id INT NOT NULL,
    current_value FLOAT DEFAULT 0,
    status ENUM('Not Started', 'In Progress', 'Completed', 'Failed') DEFAULT 'Not Started',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (requirement_id) REFERENCES requirements(id),
    UNIQUE KEY unique_member_requirement (member_id, requirement_id)
);

CREATE TABLE requirement_fulfillments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    requirement_id INT NOT NULL,
    value_added FLOAT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    recorded_by INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (requirement_id) REFERENCES requirements(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);
```

---

## 8. NEXT STEPS (Phase 3)

### 8.1 API Endpoints Creation
- [ ] Create Event API endpoints (CRUD + search)
- [ ] Create Officer API endpoints (CRUD + search)
- [ ] Create Requirement API endpoints (CRUD + search)
- [ ] Create tracking endpoints (event attendance, requirement progress)

### 8.2 Frontend Implementation
- [ ] Event management UI (create, edit, list, delete)
- [ ] Event participation/RSVP UI
- [ ] Officer management UI (appointment, term tracking)
- [ ] Requirement management UI
- [ ] Member requirement progress dashboard

### 8.3 Business Logic Implementation
- [ ] Event capacity management
- [ ] Automatic attendance marking (from event participation)
- [ ] Activity points calculation
- [ ] Requirement fulfillment automation
- [ ] Payment tracking integration

### 8.4 Integration & Testing
- [ ] Unit tests for all validation helpers
- [ ] Integration tests for API endpoints
- [ ] End-to-end workflow tests
- [ ] Performance testing for large datasets

### 8.5 UserValidationHelper Creation
- [ ] Create `temp/utils/UserValidationHelper.php`
- [ ] Validate user registration data
- [ ] Validate user updates
- [ ] Separate from MemberValidationHelper (users ≠ members)

---

## 9. ARCHITECTURE CONSISTENCY

All three modules follow the same proven architecture:

```
Frontend Form/UI
     ↓
JavaScript Handler
     ↓
API Endpoint (PHP)
     ↓
Validation Helper (Server-side)
     ↓
Database Layer (if valid)
     ↓
Structured JSON Response
     ↓
Frontend Handler
```

**Key Principles:**
1. **DTO-Driven:** DTOs are canonical source of truth
2. **Server-Side Validation:** All validation happens server-side
3. **No Frontend Logic:** Frontend is presentation layer only
4. **Framework-Agnostic:** Easy migration to Laravel
5. **Consistent Errors:** Structured error responses everywhere
6. **Single Responsibility:** Each layer has one job

---

## 10. MIGRATION TO LARAVEL

These DTOs and validation helpers will map to Laravel as follows:

**DTOs** → **Form Request Validation Classes**
```php
// Current PHP DTO
class EventCreateDTO { ... }

// Will become Laravel FormRequest
class StoreEventRequest extends FormRequest {
    public function rules() { ... }
}
```

**Validation Helpers** → **Validation Rules & Custom Validators**
```php
// Current validation helper
EventValidationHelper::validateEventCreateDTO($data)

// Will become Laravel Validation
Validator::make($data, [
    'title' => ['required', 'string', 'min:3', 'max:255'],
    ...
])
```

**Database Schema** → **Laravel Migrations**
```php
// SQL schema becomes migration
Schema::create('events', function (Blueprint $table) {
    $table->id();
    $table->string('title', 255);
    ...
})
```

---

## SUMMARY

✅ **Phase 1 (Complete):** Member Management DTOs & Validation  
✅ **Phase 2 (Complete):** Event, Officer, Requirement DTOs & Validation  
🟡 **Phase 3 (Pending):** API Endpoints & Frontend Implementation  
🟡 **Phase 4 (Pending):** Testing & Documentation  
🟡 **Phase 5 (Pending):** Laravel Migration

