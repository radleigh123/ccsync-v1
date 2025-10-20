<?php
/**
 * Member Registration Test Suite
 * 
 * Tests the member registration workflow including:
 * - User lookup by ID number
 * - Member creation with validation
 * - Error handling
 * - Edge cases
 *
 * @author CCSync Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/MemberValidationHelper.php';

class MemberRegistrationTest {
    private $conn;
    private $testResults = [];

    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }

    /**
     * Test 1: Validate MemberCreateDTO with valid data
     */
    public function testValidMemberCreateDTO() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '2003-05-15',
            'program' => 'BSIT',
            'yearLevel' => 3,
            'isPaid' => false
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_valid_dto'] = [
            'passed' => $result['valid'],
            'data' => $data,
            'errors' => $result['errors']
        ];
        return $result['valid'];
    }

    /**
     * Test 2: Missing required field (birthDate)
     */
    public function testMissingRequiredField() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            // birthDate missing
            'program' => 'BSIT',
            'yearLevel' => 3
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_missing_field'] = [
            'passed' => !$result['valid'] && isset($result['errors']['birthDate']),
            'expected_error' => 'Missing birthDate',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['birthDate']);
    }

    /**
     * Test 3: Invalid email format
     */
    public function testInvalidEmail() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'invalid-email',  // Invalid email
            'birthDate' => '2003-05-15',
            'program' => 'BSIT',
            'yearLevel' => 3
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_invalid_email'] = [
            'passed' => !$result['valid'] && isset($result['errors']['email']),
            'expected_error' => 'Invalid email format',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['email']);
    }

    /**
     * Test 4: Invalid program (not in enum)
     */
    public function testInvalidProgram() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '2003-05-15',
            'program' => 'INVALID_PROGRAM',  // Invalid
            'yearLevel' => 3
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_invalid_program'] = [
            'passed' => !$result['valid'] && isset($result['errors']['program']),
            'expected_error' => 'Program not in enum: BSIT, BSCS, BSIS',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['program']);
    }

    /**
     * Test 5: Invalid year level (out of range)
     */
    public function testInvalidYearLevel() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '2003-05-15',
            'program' => 'BSIT',
            'yearLevel' => 5  // Invalid: must be 1-4
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_invalid_year_level'] = [
            'passed' => !$result['valid'] && isset($result['errors']['yearLevel']),
            'expected_error' => 'yearLevel out of range (1-4)',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['yearLevel']);
    }

    /**
     * Test 6: Invalid date format
     */
    public function testInvalidDateFormat() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '05-15-2003',  // Invalid format (should be YYYY-MM-DD)
            'program' => 'BSIT',
            'yearLevel' => 3
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_invalid_date'] = [
            'passed' => !$result['valid'] && isset($result['errors']['birthDate']),
            'expected_error' => 'Date format must be YYYY-MM-DD',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['birthDate']);
    }

    /**
     * Test 7: Non-integer userId
     */
    public function testInvalidUserIdType() {
        $data = [
            'userId' => 'string_user_id',  // Should be int
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '2003-05-15',
            'program' => 'BSIT',
            'yearLevel' => 3
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_invalid_userid_type'] = [
            'passed' => !$result['valid'] && isset($result['errors']['userId']),
            'expected_error' => 'userId must be integer',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['userId']);
    }

    /**
     * Test 8: Valid optional fields (isPaid as boolean)
     */
    public function testValidOptionalFields() {
        $data = [
            'userId' => 1,
            'idNumber' => '20023045',
            'firstName' => 'Juan',
            'lastName' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'birthDate' => '2003-05-15',
            'program' => 'BSIT',
            'yearLevel' => 3,
            'isPaid' => true,  // Valid boolean
            'suffix' => 'Jr.',  // Valid optional string
            'enrollmentDate' => '2025-08-20'
        ];

        $result = MemberValidationHelper::validateMemberCreateDTO($data);
        $this->testResults['test_valid_optional'] = [
            'passed' => $result['valid'],
            'data' => $data,
            'errors' => $result['errors']
        ];
        return $result['valid'];
    }

    /**
     * Test 9: MemberUpdateDTO with partial fields
     */
    public function testMemberUpdateDTOPartial() {
        $data = [
            'isPaid' => true,  // Only update isPaid
            'suffix' => 'Sr.'
        ];

        $result = MemberValidationHelper::validateMemberUpdateDTO($data);
        $this->testResults['test_update_partial'] = [
            'passed' => $result['valid'],
            'data' => $data,
            'errors' => $result['errors']
        ];
        return $result['valid'];
    }

    /**
     * Test 10: MemberUpdateDTO with invalid data
     */
    public function testMemberUpdateDTOInvalid() {
        $data = [
            'yearLevel' => 10  // Invalid: must be 1-4
        ];

        $result = MemberValidationHelper::validateMemberUpdateDTO($data);
        $this->testResults['test_update_invalid'] = [
            'passed' => !$result['valid'] && isset($result['errors']['yearLevel']),
            'expected_error' => 'yearLevel out of range',
            'actual_errors' => $result['errors']
        ];
        return !$result['valid'] && isset($result['errors']['yearLevel']);
    }

    /**
     * Print all test results
     */
    public function printResults() {
        echo "\n=== MEMBER REGISTRATION TEST SUITE ===\n\n";
        
        $totalTests = count($this->testResults);
        $passedTests = 0;

        foreach ($this->testResults as $testName => $result) {
            $status = $result['passed'] ? '✓ PASS' : '✗ FAIL';
            echo "$status: $testName\n";
            if (!$result['passed']) {
                echo "  Expected: " . ($result['expected_error'] ?? 'Test expectation not met') . "\n";
                if (!empty($result['errors'])) {
                    echo "  Actual Errors: " . json_encode($result['errors']) . "\n";
                }
            }
            if ($result['passed']) $passedTests++;
            echo "\n";
        }

        echo "=== SUMMARY ===\n";
        echo "Passed: $passedTests / $totalTests\n";
        echo "Status: " . ($passedTests === $totalTests ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗') . "\n";
    }
}

// Run tests
try {
    $tester = new MemberRegistrationTest($conn);
    
    $tester->testValidMemberCreateDTO();
    $tester->testMissingRequiredField();
    $tester->testInvalidEmail();
    $tester->testInvalidProgram();
    $tester->testInvalidYearLevel();
    $tester->testInvalidDateFormat();
    $tester->testInvalidUserIdType();
    $tester->testValidOptionalFields();
    $tester->testMemberUpdateDTOPartial();
    $tester->testMemberUpdateDTOInvalid();
    
    $tester->printResults();
} catch (Exception $e) {
    echo "Test Suite Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
?>
