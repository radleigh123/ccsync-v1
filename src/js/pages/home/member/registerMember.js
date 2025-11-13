/**
 * Register Member Page Handler
 *
 * Manages the member registration workflow:
 * 1. Search for a user by ID number (API call to getUserByIdNumber.php)
 * 2. Auto-fill readonly fields (firstName, lastName, email)
 * 3. Enable editable fields (birthDate, yearLevel, program, isPaid)
 * 4. User fills in member details with inline validation
 * 5. On form submit, validate with FormValidator (shows inline errors)
 * 6. Show confirmation modal with complete details
 * 7. Submit member registration to createMember.php
 *
 * IMPORTANT: userId is intentionally NOT sent to createMember.php
 * Members are identified by idNumber (school ID), allowing independent tracking
 *
 * @author CCSync Development Team
 * @version 1.0
 */

import "/js/utils/core.js";
import "/scss/pages/home/member/registerMember.scss";
import "/scss/confirmationModal.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";
import { responseModal } from "/js/utils/errorSuccessModal.js";
import { confirmationModal } from "/js/utils/confirmationModal.js";
import { FormValidator } from "/js/utils/FormValidator.js";

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize sidebar navigation
    setSidebar();

    // Validate user session
    const session = await getCurrentSession();
    if (!session) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    // Form elements
    const searchBtn = document.getElementById('searchBtn');
    const idNumberInput = document.getElementById('idNumber');
    const searchMessage = document.getElementById('searchMessage');
    const memberForm = document.getElementById('memberForm');
    const registerBtn = document.getElementById('registerBtn');

    // Readonly fields (auto-filled from user lookup)
    const emailInput = document.getElementById('email');

    // Editable fields (user can fill after lookup)
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const suffixInput = document.getElementById('suffix');
    const birthDateInput = document.getElementById('birthDate');
    const yearLevelInput = document.getElementById('yearLevel');
    const programInput = document.getElementById('program');
    const isPaidInput = document.getElementById('isPaid');

    let foundUser = null;
    let formValidator = null;

    // Initialize FormValidator for inline validation on member details
    formValidator = new FormValidator(memberForm);

    /**
     * Search for a user by ID number
     * Fetches user data from the ccsync-api-plain backend API
     * Also checks if the user is already registered as a member
     */
    searchBtn.addEventListener('click', async function () {
        const idNumber = idNumberInput.value.trim();

        if (!idNumber) {
            showSearchMessage('Please enter an ID number', 'danger');
            return;
        }

        try {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Searching...';

            // First, search for the user

            const memberIdSchoolNumber = encodeURIComponent(idNumber);
            const response = await fetch(`http://localhost:8000/api/users/user?id_school_number=${memberIdSchoolNumber}`, {
                headers: {
                    Authorization: `Bearer ${session.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }
            });

            const data = await response.json();
            const user = data.user;

            if (response.ok) {
                foundUser = user;
                
                if (user?.member !== null) {
                    showSearchMessage('User is already registered', 'warning');
                    clearForm();
                    enableEditableFields(false);
                    registerBtn.disabled = true;
                    foundUser = null;
                    return;
                }

                // User exists and is not a member - proceed
                autoFillUserFields(foundUser);
                enableEditableFields(true);
                registerBtn.disabled = false;
                showSearchMessage('User found! Please complete the registration form below.', 'success');
            } else {
                showSearchMessage(userResult.message || 'User not found', 'danger');
                clearForm();
                enableEditableFields(false);
                registerBtn.disabled = true;
                foundUser = null;
            }
        } catch (error) {
            console.error('Error searching user:', error);
            showSearchMessage('An error occurred while searching. Please try again.', 'danger');
            enableEditableFields(false);
            registerBtn.disabled = true;
            foundUser = null;
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = 'Search User';
        }
    });

    /**
     * Auto-fill readonly user fields
     * @param {Object} user User data from API
     */
    function autoFillUserFields(user) {
        firstNameInput.value = user.display_name || '';
        emailInput.value = user.email || '';
        idNumberInput.value = user.id_school_number || '';
    }

    /**
     * Show confirmation modal with user data and member details
     * Allows user to verify ALL information before final registration submission
     * @param {Object} user User data from API
     * @param {Object} memberData Member form data to be submitted
     */
    function showConfirmationModal(user, memberData) {
        // Format year level for display
        const yearLevelMap = {
            '1': '1st Year',
            '2': '2nd Year',
            '3': '3rd Year',
            '4': '4th Year'
        };
        const yearDisplay = yearLevelMap[memberData.year] || memberData.year;

        const detailsHTML = `
            <div class="confirmation-section">
                <h6 class="mb-3"><strong>User Information</strong></h6>
                <div class="detail-item">
                    <span class="detail-label">ID Number:</span>
                    <span class="detail-value">${user.id_school_number}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${memberData.first_name} ${memberData.last_name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email}</span>
                </div>
            </div>
            <hr class="my-3">
            <div class="confirmation-section">
                <h6 class="mb-3"><strong>Member Details</strong></h6>
                <div class="detail-item">
                    <span class="detail-label">Year Level:</span>
                    <span class="detail-value">${yearDisplay}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Program:</span>
                    <span class="detail-value">${memberData.program}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Birth Date:</span>
                    <span class="detail-value">${memberData.birth_date}</span>
                </div>
                ${memberData.suffix ? `<div class="detail-item">
                    <span class="detail-label">Suffix:</span>
                    <span class="detail-value">${memberData.suffix}</span>
                </div>` : ''}
                <div class="detail-item">
                    <span class="detail-label">Paid Status:</span>
                    <span class="detail-value">${memberData.is_paid ? 'Yes, Paid' : 'Not Paid'}</span>
                </div>
            </div>
        `;

        confirmationModal.show(
            'Confirm Registration Details',
            'Please review all information below before confirming. Click "Confirm & Register" to proceed.',
            {
                details: detailsHTML,
                yesText: 'Confirm & Register',
                noText: 'Cancel',
                onYes: () => {
                    // User confirmed - proceed with actual registration API call
                    submitMemberRegistration(memberData);
                    idNumberInput.focus();
                },
                onNo: () => {
                    // User declined - reset for new search
                    foundUser = null;
                    clearForm();
                    enableEditableFields(false);
                    registerBtn.disabled = true;
                    idNumberInput.value = '';
                    idNumberInput.focus();
                    showSearchMessage('Search cancelled. Please enter a different ID.', 'info');
                }
            }
        );
    }

    /**
     * Clear all form fields
     */
    function clearForm() {
        firstNameInput.value = '';
        lastNameInput.value = '';
        emailInput.value = '';
        suffixInput.value = '';
        birthDateInput.value = '';
        yearLevelInput.value = '';
        programInput.value = '';
        isPaidInput.checked = false;
    }

    /**
     * Enable or disable editable fields
     * @param {boolean} enabled Whether to enable fields
     */
    function enableEditableFields(enabled) {
        firstNameInput.disabled = !enabled;
        lastNameInput.disabled = !enabled;
        suffixInput.disabled = !enabled;
        birthDateInput.disabled = !enabled;
        yearLevelInput.disabled = !enabled;
        programInput.disabled = !enabled;
        isPaidInput.disabled = !enabled;
    }

    /**
     * Display search result message
     * @param {string} message Message to display
     * @param {string} type Message type (success, danger, warning)
     */
    function showSearchMessage(message, type = 'info') {
        searchMessage.textContent = message;
        searchMessage.className = `alert alert-${type} mt-2`;
        searchMessage.style.display = 'block';
    }

    /**
     * Submit member registration to API
     * This is called AFTER user confirms in the confirmation modal
     * @param {Object} memberData Prepared member data to submit
     */
    async function submitMemberRegistration(memberData) {
        try {
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';

            const response = await fetch('http://localhost:8000/api/members', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(memberData)
            });

            const result = await response.json();

            if (response.ok) {
                responseModal.showSuccess(
                    'Member Registered Successfully!',
                    `${memberData.first_name} ${memberData.last_name} has been registered as a member.`
                );
                
                clearForm();
                enableEditableFields(false);
                idNumberInput.value = '';
                registerBtn.disabled = true;
                foundUser = null;

                window.location.href = '/pages/home/member/view-member.html';
                return;
            } else {
                // Handle specific error cases
                if (response.status === 409) {
                    // Duplicate member - show in search message area
                    showSearchMessage(result.message || 'This student is already registered as a member', 'danger');
                } else {
                    // Other errors - show in modal
                    responseModal.showError(
                        'Registration Failed',
                        result.message || 'An error occurred while registering the member.'
                    );
                }
            }
        } catch (error) {
            console.error('Error registering member:', error);
            responseModal.showError(
                'Registration Error',
                'An unexpected error occurred while registering the member. Please try again.'
            );
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = 'Register Member';
        }
    }

    /**
     * Handle form submission
     * Validates all required fields with FormValidator (shows inline errors)
     * Then shows confirmation modal with complete details
     * IMPORTANT: userId is intentionally NOT sent - members identified by idNumber
     */
    memberForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!foundUser) {
            showSearchMessage('Please search for and confirm a user first', 'warning');
            return;
        }

        // Validate the form using FormValidator (shows inline errors)
        if (!formValidator.validateForm()) {
            console.log("❌ Form validation failed - please fix the highlighted fields");
            return;
        }

        // Prepare data from camelCase to snake_case format for ccsync-api-plain
        // IMPORTANT: userId is intentionally excluded - members tracked by idNumber
        const memberData = {
            user_id: foundUser.id,
            id_school_number: foundUser.id_school_number,
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
            email: foundUser.email,
            suffix: suffixInput.value || null,
            birth_date: birthDateInput.value,
            year: parseInt(yearLevelInput.value),
            program: programInput.value,
            is_paid: isPaidInput.checked ? 1 : 0,
            enrollment_date: new Date().toISOString().split('T')[0]
        };

        // Show confirmation modal with all details before submission
        showConfirmationModal(foundUser, memberData);
    });

    // Allow Enter key to search
    idNumberInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
});
