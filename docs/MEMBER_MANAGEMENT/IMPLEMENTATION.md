# Member Registration Implementation

## Overview

The member registration system distinguishes between **Users** and **Members**:

- **Users**: People registered in the system with basic info (name, email, school ID)
- **Members**: Users who are enrolled as organization members with additional details (birth date, year level, program, payment status)

This two-table structure allows:
- Scoping membership to specific semesters (future feature)
- Tracking members separately from general users
- Clear separation of concerns

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name_first VARCHAR(255),
  name_last VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  id_school_number VARCHAR(20) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN', 'USER'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Members Table
```sql
CREATE TABLE members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  suffix VARCHAR(50),
  id_school_number INT UNIQUE,
  email VARCHAR(255),
  birth_date DATE,
  enrollment_date DATE,
  program VARCHAR(255),
  year TINYINT (1-4),
  is_paid TINYINT (0 or 1),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Registration Workflow

### Step 1: Search User by ID
- Officer enters user's school ID number
- System calls `/temp/auth/getUserByIdNumber.php`
- Returns user's firstName, lastName, email if found

### Step 2: Auto-fill & Enable Fields
- **Auto-filled (readonly)**:
  - First Name
  - Last Name
  - Email
- **Enabled (editable)**:
  - Suffix (optional)
  - Birth Date (required)
  - Year Level (required)
  - Program (required)
  - Is Paid (optional checkbox)

### Step 3: Submit Member Registration
- Officer fills editable fields
- System calls `/temp/members/createMember.php`
- Saves to members table
- Links to user via id_school_number

## API Endpoints

### GET /temp/auth/getUserByIdNumber.php

**Query Parameter:**
```
idNumber=20023045
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan.delacruz@example.com",
    "idNumber": "20023045"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### POST /temp/members/createMember.php

**Request Body:**
```json
{
  "userId": 1,
  "idNumber": "20023045",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan.delacruz@example.com",
  "suffix": "Jr.",
  "birthDate": "2003-05-15",
  "yearLevel": 3,
  "program": "BSIT",
  "isPaid": true,
  "enrollmentDate": "2025-08-20"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": 1,
    "idNumber": "20023045"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Member already exists for this ID number"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required field: birthDate"
}
```

## DTOs

### UserDTO (`src/DTOs/UserDTO.php`)
Basic user information for registration:
- firstName: string
- lastName: string
- email: string
- idNumber: string
- password: string (optional)
- role: string (ADMIN or USER)

### MemberDTO (`src/DTOs/MemberDTO.php`)
Member-specific information:
- userId: int
- firstName: string (auto-filled)
- lastName: string (auto-filled)
- email: string (auto-filled)
- idNumber: string (unique identifier)
- suffix: string (optional)
- birthDate: string (YYYY-MM-DD)
- enrollmentDate: string (YYYY-MM-DD)
- program: string (BSIT, BSCS, BSIS)
- yearLevel: int (1-4)
- isPaid: bool
- semesterId: int (optional, for future use)

## Frontend Logic

### Form States

**Initial State:**
- ID number input: enabled
- Search button: enabled
- All form fields: disabled

**Before Search:**
- User enters ID number
- Can press Enter or click Search button

**After Successful Search:**
- ID number input: disabled
- Readonly fields (name, email): populated from API
- Editable fields: enabled
- Register button: enabled

**After Failed Search:**
- ID number input: remains enabled for retry
- Error message displayed
- All form fields: remain disabled
- Register button: disabled

**After Submission:**
- Loading state: "Registering..."
- On success: redirect to member list after 2 seconds
- On error: display error message, allow retry

### JavaScript File: `src/js/pages/home/member/registerMember.js`

Key Functions:
- `searchBtn.click()`: Fetch user by ID from API
- `autoFillUserFields()`: Populate readonly fields
- `enableEditableFields()`: Toggle field states
- `memberForm.submit()`: Validate and send member data
- `showSearchMessage()`: Display status messages

## Form Fields Reference

| Field | Type | Auto-filled | Required | Readonly |
|-------|------|:-----------:|:--------:|:--------:|
| ID Number | text | ✗ | ✓ | ✗ |
| First Name | text | ✓ | ✓ | ✓ |
| Last Name | text | ✓ | ✓ | ✓ |
| Email | email | ✓ | ✓ | ✓ |
| Suffix | text | ✗ | ✗ | ✗ |
| Birth Date | date | ✗ | ✓ | ✗ |
| Year Level | select | ✗ | ✓ | ✗ |
| Program | select | ✗ | ✓ | ✗ |
| Is Paid | checkbox | ✗ | ✗ | ✗ |

## Error Handling

**User Not Found:**
- Display: "User not found"
- Disable form
- Allow retry

**Duplicate Member:**
- Display: "Member already exists for this ID number"
- User must provide different ID

**Validation Failures:**
- Birth Date missing: "Birth date is required"
- Year Level missing: "Year level is required"
- Program missing: "Program is required"

**Server Errors:**
- Generic message: "An error occurred. Please try again."
- Detailed errors logged to browser console

## Testing

### Test Case 1: Valid User Registration
1. Enter valid ID number (e.g., 20023045)
2. Click "Search User"
3. Verify fields auto-fill
4. Fill Birth Date, Year Level, Program
5. Click "Register Member"
6. Verify success and redirect

### Test Case 2: User Not Found
1. Enter invalid ID number
2. Click "Search User"
3. Verify error message appears
4. Verify form fields remain disabled

### Test Case 3: Duplicate Member
1. Register member with ID X
2. Try to register same ID again
3. Verify "Member already exists" error

### Test Case 4: Validation Error
1. Search valid user
2. Leave Birth Date empty
3. Try to submit
4. Verify "Birth date is required" error

## Future Enhancements

1. **Semester Scoping**: Add semesterId to members table
2. **Batch Registration**: Allow multiple member registrations
3. **Member Status**: Track member status (active, inactive, suspended)
4. **Officer Assignments**: Link members to officers/roles
5. **Payment Tracking**: Track payment dates and amounts
