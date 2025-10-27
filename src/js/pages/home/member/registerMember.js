/**
 * Register Member Page Handler
 *
 * Manages the member registration workflow:
 * 1. Search for a user by ID number (API call to getUserByIdNumber.php)
 * 2. Auto-fill readonly fields (firstName, lastName, email)
 * 3. Enable editable fields (birthDate, yearLevel, program, isPaid)
 * 4. Submit member registration to createMember.php
 *
 * @author CCSync Development Team
 * @version 1.0
 */

import "/js/utils/core.js";
import "/scss/pages/home/member/registerMember.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";

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
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');

    // Editable fields (user can fill after lookup)
    const suffixInput = document.getElementById('suffix');
    const birthDateInput = document.getElementById('birthDate');
    const yearLevelInput = document.getElementById('yearLevel');
    const programInput = document.getElementById('program');
    const isPaidInput = document.getElementById('isPaid');

    let foundUser = null;

    /**
     * Search for a user by ID number
     * Fetches user data from the ccsync-api-plain backend API
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

            const response = await fetch(`http://localhost:8080/ccsync-plain-php/auth/getUserByIdNumber.php?idNumber=${encodeURIComponent(idNumber)}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const result = await response.json();

            if (result.success) {
                foundUser = result.data;
                autoFillUserFields(foundUser);
                enableEditableFields(true);
                showSearchMessage('User found! Please complete the registration.', 'success');
                registerBtn.disabled = false;
            } else {
                showSearchMessage(result.message || 'User not found', 'danger');
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
        firstNameInput.value = user.firstName || '';
        lastNameInput.value = user.lastName || '';
        emailInput.value = user.email || '';
        idNumberInput.value = user.idNumber || '';
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
     * Handle form submission
     * Validates and sends member registration to backend
     */
    memberForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!foundUser) {
            showSearchMessage('Please search for a user first', 'warning');
            return;
        }

        // Validate required fields
        if (!birthDateInput.value) {
            showSearchMessage('Birth date is required', 'danger');
            return;
        }

        if (!yearLevelInput.value) {
            showSearchMessage('Year level is required', 'danger');
            return;
        }

        if (!programInput.value) {
            showSearchMessage('Program is required', 'danger');
            return;
        }

        try {
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';

            // Transform data from camelCase to snake_case format for ccsync-api-plain
            const memberData = {
                user_id: foundUser.id,
                id_school_number: foundUser.idNumber,
                first_name: foundUser.firstName,
                last_name: foundUser.lastName,
                email: foundUser.email,
                suffix: suffixInput.value || null,
                birth_date: birthDateInput.value,
                year: parseInt(yearLevelInput.value),
                program: programInput.value,
                is_paid: isPaidInput.checked ? 1 : 0,
                enrollment_date: new Date().toISOString().split('T')[0]
            };

            const response = await fetch('http://localhost:8080/ccsync-plain-php/member/createMember.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            });

            const result = await response.json();

            if (result.success) {
                showSearchMessage('Member registered successfully!', 'success');
                clearForm();
                enableEditableFields(false);
                idNumberInput.value = '';
                searchMessage.style.display = 'none';
                foundUser = null;

                // Optionally redirect or show success
                setTimeout(() => {
                    window.location.href = '?page=member/view-member';
                }, 2000);
            } else {
                showSearchMessage(result.message || 'Error registering member', 'danger');
            }
        } catch (error) {
            console.error('Error registering member:', error);
            showSearchMessage('An error occurred while registering. Please try again.', 'danger');
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = 'Register Member';
        }
    });

    // Allow Enter key to search
    idNumberInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
});
