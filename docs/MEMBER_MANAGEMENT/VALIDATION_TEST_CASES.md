# Member Registration Validation Test Cases

## Overview
Comprehensive test cases for member registration API endpoints
**Validation Location**: Server-side only (no frontend validation)
**Validation Helper**: `temp/utils/MemberValidationHelper.php`

---

## Test Cases for POST /temp/members/createMember.php

### Category 1: Valid Complete Registration

#### TC1.1: Valid Complete Registration
**Input**:
```json
{
  "userId": 1,
  "idNumber": "20023045",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan@example.com",
  "suffix": "Jr.",
  "birthDate": "2003-05-15",
  "program": "BSIT",
  "yearLevel": 3,
  "isPaid": true,
  "enrollmentDate": "2025-08-20"
}
```
**Expected**: HTTP 201, Member created successfully

#### TC1.2: Valid Registration Without Optional Fields
**Input**:
```json
{
  "userId": 1,
  "idNumber": "20023045",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan@example.com",
  "birthDate": "2003-05-15",
  "program": "BSCS",
  "yearLevel": 2
}
```
**Expected**: HTTP 201, isPaid defaults to false, enrollmentDate defaults to today

#### TC1.3: Valid with Different Program
**Input**:
```json
{
  "userId": 2,
  "idNumber": "20234567",
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@example.com",
  "birthDate": "2004-03-20",
  "program": "BSIS",
  "yearLevel": 1
}
```
**Expected**: HTTP 201, Member created with BSIS program

---

### Category 2: Missing Required Fields

#### TC2.1: Missing userId
**Input**: Same as TC1.1 but without userId
**Expected**: HTTP 400, Error: "userId: Required field missing"

#### TC2.2: Missing idNumber
**Input**: Same as TC1.1 but without idNumber
**Expected**: HTTP 400, Error: "idNumber: Required field missing"

#### TC2.3: Missing firstName
**Input**: Same as TC1.1 but without firstName
**Expected**: HTTP 400, Error: "firstName: Required field missing"

#### TC2.4: Missing lastName
**Input**: Same as TC1.1 but without lastName
**Expected**: HTTP 400, Error: "lastName: Required field missing"

#### TC2.5: Missing email
**Input**: Same as TC1.1 but without email
**Expected**: HTTP 400, Error: "email: Required field missing"

#### TC2.6: Missing birthDate
**Input**: Same as TC1.1 but without birthDate
**Expected**: HTTP 400, Error: "birthDate: Required field missing"

#### TC2.7: Missing program
**Input**: Same as TC1.1 but without program
**Expected**: HTTP 400, Error: "program: Required field missing"

#### TC2.8: Missing yearLevel
**Input**: Same as TC1.1 but without yearLevel
**Expected**: HTTP 400, Error: "yearLevel: Required field missing"

---

### Category 3: Invalid Data Types

#### TC3.1: userId is String (Should be Int)
**Input**:
```json
{
  "userId": "1",
  "idNumber": "20023045",
  ...rest of valid data
}
```
**Expected**: HTTP 400, Error: "userId must be a positive integer"

#### TC3.2: userId is Negative
**Input**:
```json
{
  "userId": -1,
  "idNumber": "20023045",
  ...rest of valid data
}
```
**Expected**: HTTP 400, Error: "userId must be a positive integer"

#### TC3.3: idNumber is Integer (Should be String)
**Input**:
```json
{
  "userId": 1,
  "idNumber": 20023045,
  ...rest of valid data
}
```
**Expected**: HTTP 400, Error: "idNumber must be a non-empty string"

#### TC3.4: firstName is Empty String
**Input**:
```json
{
  ...all valid...
  "firstName": ""
}
```
**Expected**: HTTP 400, Error: "firstName must be a non-empty string"

#### TC3.5: email is Invalid Format
**Input**:
```json
{
  ...all valid...
  "email": "not-an-email"
}
```
**Expected**: HTTP 400, Error: "email must be a valid email address"

#### TC3.6: yearLevel is String (Should be Int)
**Input**:
```json
{
  ...all valid...
  "yearLevel": "3"
}
```
**Expected**: HTTP 400, Error: "yearLevel must be one of: 1, 2, 3, 4"

#### TC3.7: isPaid is String (Should be Bool)
**Input**:
```json
{
  ...all valid...
  "isPaid": "true"
}
```
**Expected**: HTTP 400, Error: "isPaid must be a boolean"

---

### Category 4: Invalid Date Formats

#### TC4.1: birthDate Invalid Format (DD-MM-YYYY)
**Input**:
```json
{
  ...all valid...
  "birthDate": "15-05-2003"
}
```
**Expected**: HTTP 400, Error: "birthDate must be in YYYY-MM-DD format"

#### TC4.2: birthDate Invalid Format (Incomplete)
**Input**:
```json
{
  ...all valid...
  "birthDate": "2003-05"
}
```
**Expected**: HTTP 400, Error: "birthDate must be in YYYY-MM-DD format"

#### TC4.3: birthDate Invalid Date (Feb 30)
**Input**:
```json
{
  ...all valid...
  "birthDate": "2003-02-30"
}
```
**Expected**: HTTP 400, Error: "birthDate must be in YYYY-MM-DD format"

#### TC4.4: enrollmentDate Invalid Format
**Input**:
```json
{
  ...all valid...
  "enrollmentDate": "August 20 2025"
}
```
**Expected**: HTTP 400, Error: "enrollmentDate must be in YYYY-MM-DD format"

---

### Category 5: Invalid Enum Values

#### TC5.1: program Invalid Value
**Input**:
```json
{
  ...all valid...
  "program": "BS ENGINEERING"
}
```
**Expected**: HTTP 400, Error: "program must be one of: BSIT, BSCS, BSIS"

#### TC5.2: program Empty String
**Input**:
```json
{
  ...all valid...
  "program": ""
}
```
**Expected**: HTTP 400, Error: "program must be one of: BSIT, BSCS, BSIS"

#### TC5.3: yearLevel Invalid Value (0)
**Input**:
```json
{
  ...all valid...
  "yearLevel": 0
}
```
**Expected**: HTTP 400, Error: "yearLevel must be one of: 1, 2, 3, 4"

#### TC5.4: yearLevel Invalid Value (5)
**Input**:
```json
{
  ...all valid...
  "yearLevel": 5
}
```
**Expected**: HTTP 400, Error: "yearLevel must be one of: 1, 2, 3, 4"

---

### Category 6: Business Rule Validation

#### TC6.1: Duplicate Member Registration
**Precondition**: Member with idNumber "20023045" already exists
**Input**:
```json
{
  "userId": 1,
  "idNumber": "20023045",
  ...rest of valid data
}
```
**Expected**: HTTP 409, Error: "Member already exists for this ID number"

#### TC6.2: User Not Found in Users Table
**Precondition**: userId 999 does not exist in users table
**Input**:
```json
{
  "userId": 999,
  "idNumber": "20023045",
  ...rest of valid data
}
```
**Expected**: HTTP 404, Error: "User not found"

---

### Category 7: Boundary Value Tests

#### TC7.1: Minimum yearLevel
**Input**:
```json
{
  ...all valid...
  "yearLevel": 1
}
```
**Expected**: HTTP 201, Member created successfully

#### TC7.2: Maximum yearLevel
**Input**:
```json
{
  ...all valid...
  "yearLevel": 4
}
```
**Expected**: HTTP 201, Member created successfully

#### TC7.3: Very Long idNumber
**Input**:
```json
{
  ...all valid...
  "idNumber": "123456789012345"
}
```
**Expected**: HTTP 201, Member created successfully (assuming valid length)

#### TC7.4: Special Characters in Names
**Input**:
```json
{
  ...all valid...
  "firstName": "Jean-Pierre",
  "lastName": "O'Brien"
}
```
**Expected**: HTTP 201, Member created successfully

---

### Category 8: Null/Whitespace Edge Cases

#### TC8.1: Null suffix (Should be Accepted)
**Input**:
```json
{
  ...all valid...
  "suffix": null
}
```
**Expected**: HTTP 201, Member created with suffix=NULL

#### TC8.2: Whitespace-only firstName
**Input**:
```json
{
  ...all valid...
  "firstName": "   "
}
```
**Expected**: HTTP 400, Error: "firstName must be a non-empty string"

#### TC8.3: Multiple Spaces in Name
**Input**:
```json
{
  ...all valid...
  "firstName": "  Juan  "
}
```
**Expected**: HTTP 201 or 400 (depending on trim() implementation - should trim)

---

## Test Cases for GET /temp/auth/getUserByIdNumber.php

### Category 1: Valid User Lookup

#### TC_USER1.1: Valid ID Number Exists
**Input**: `?idNumber=20023045`
**Expected**: HTTP 200
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idNumber": "20023045",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com"
  }
}
```

#### TC_USER1.2: Different Valid ID Number
**Input**: `?idNumber=20234567`
**Expected**: HTTP 200, Returns that user's data

---

### Category 2: Invalid Lookup

#### TC_USER2.1: ID Number Not Found
**Input**: `?idNumber=99999999`
**Expected**: HTTP 404
```json
{
  "success": false,
  "message": "User not found"
}
```

#### TC_USER2.2: Missing Query Parameter
**Input**: (no parameters)
**Expected**: HTTP 400
```json
{
  "success": false,
  "message": "ID number is required"
}
```

#### TC_USER2.3: Empty Query Parameter
**Input**: `?idNumber=`
**Expected**: HTTP 400
```json
{
  "success": false,
  "message": "ID number is required"
}
```

---

## Test Execution Instructions

### Manual Testing with cURL

```bash
# TC1.1: Valid Complete Registration
curl -X POST http://localhost/temp/members/createMember.php \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "idNumber": "20023045",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com",
    "suffix": "Jr.",
    "birthDate": "2003-05-15",
    "program": "BSIT",
    "yearLevel": 3,
    "isPaid": true
  }'

# TC2.1: Missing userId
curl -X POST http://localhost/temp/members/createMember.php \
  -H "Content-Type: application/json" \
  -d '{
    "idNumber": "20023045",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan@example.com",
    "birthDate": "2003-05-15",
    "program": "BSIT",
    "yearLevel": 3
  }'

# TC_USER1.1: Valid User Lookup
curl http://localhost/temp/auth/getUserByIdNumber.php?idNumber=20023045
```

---

## Test Summary Matrix

| Category | Total Tests | Pass | Fail | Notes |
|----------|------------|------|------|-------|
| Valid Registration | 3 | | | All edge cases with valid data |
| Missing Fields | 8 | | | Each required field tested |
| Invalid Data Types | 7 | | | Type mismatches detected |
| Invalid Dates | 4 | | | Date format and validity |
| Invalid Enums | 4 | | | Program and yearLevel values |
| Business Rules | 2 | | | Duplicate and foreign key checks |
| Boundary Values | 4 | | | Min/max and special chars |
| Null/Whitespace | 3 | | | Edge cases with empty data |
| User Lookup Valid | 2 | | | Happy path |
| User Lookup Invalid | 3 | | | Error conditions |
| **TOTAL** | **40** | | | |

---

## Validation Flow Diagram

```
Client Request (JSON)
    ↓
MemberValidationHelper::validateMemberCreateDTO()
    ↓
    ├─ Required Field Check → Error 400
    ├─ Type Validation → Error 400
    ├─ Enum Validation → Error 400
    └─ Format Validation → Error 400
    ↓ (All pass)
Business Logic Check
    ├─ User Exists? → Error 404
    └─ Member Not Duplicate? → Error 409
    ↓ (All pass)
Insert to Database
    ↓
Success 201 Response
```

---

## Notes

- All validation happens **server-side only**
- Frontend has no validation logic
- DTOs define the contract for valid data
- Validation Helper enforces DTO contracts
- No unnecessary API calls (only 2 per registration)
- Error messages are specific and actionable
- Type checking prevents SQL injection and data corruption
