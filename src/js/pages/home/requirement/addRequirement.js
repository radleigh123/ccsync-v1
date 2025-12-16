/**
 * Add Requirement Page Handler
 *
 * Manages the requirement creation workflow:
 * 1. Validate form inputs with FormValidator (inline validation)
 * 2. Show confirmation modal with requirement details
 * 3. Submit requirement creation to createRequirement
 * 4. Show success/error modal with response
 * 5. Redirect to view-requirement.html on success
 *
 * @author CCSync Development Team
 * @version 1.0
 */

import "/js/utils/core.js";
import "/scss/pages/home/requirement/addRequirement.scss";
import "/scss/confirmationModal.scss";
// import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";
import { createRequirement } from "/js/utils/api.js";
import { responseModal } from "/js/utils/errorSuccessModal.js";
import { confirmationModal } from "/js/utils/confirmationModal.js";
import { FormValidator } from "/js/utils/FormValidator.js";
import { setupLogout } from "/js/utils/navigation.js";

document.addEventListener('DOMContentLoaded', async function () {
    setupLogout();
    // Initialize sidebar navigation
    // setSidebar();

    // Validate user session
    const session = await getCurrentSession();
    if (!session) {
        window.location.href = '/pages/auth/login.html';
        return;
    }

    // Setup back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/pages/home/requirement/view-requirement.html';
        });
    }

    const requirementForm = document.getElementById('requirementForm');
    const submitBtn = requirementForm.querySelector('button[type="submit"]');

    // Form fields
    const nameInput = document.getElementById('requirementName');
    const dateInput = document.getElementById('requirementDate');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');

    let formValidator = null;

    // Initialize FormValidator for inline validation
    formValidator = new FormValidator(requirementForm);

    /**
     * Handle form submission
     */
    requirementForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate form with FormValidator
        const isValid = formValidator.validateForm();
        if (!isValid) {
            responseModal.showError(
                "Validation Error",
                "Please fix the errors in the form"
            );
            return;
        }

        // Get form values
        const requirement = {
            name: nameInput.value.trim(),
            requirementDate: dateInput.value,
            description: descriptionInput.value.trim() || null,
            status: statusInput.value || 'open'
        };

        // Show confirmation modal
        const detailsHtml = `
            <div class="confirmation-details">
                <p><strong>Name:</strong> ${escapeHtml(requirement.name)}</p>
                <p><strong>Deadline:</strong> ${requirement.requirementDate}</p>
                <p><strong>Status:</strong> ${capitalizeFirst(requirement.status)}</p>
                ${requirement.description ? `<p><strong>Description:</strong> ${escapeHtml(requirement.description)}</p>` : ''}
            </div>
        `;

        confirmationModal.show(
            "Create Requirement",
            "Please confirm the requirement details:",
            {
                details: detailsHtml,
                onYes: () => submitRequirement(requirement, session),
                yesText: "Create",
                noText: "Cancel"
            }
        );
    });

    /**
     * Submit requirement to API
     */
    async function submitRequirement(requirement, session) {
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating...';

            const data = await createRequirement(requirement);

            if (data.success) {
                // Show success modal and redirect to single view page
                const requirementId = data.requirement?.id;
                responseModal.showSuccess(
                    "Success!",
                    "Requirement created successfully!",
                    () => {
                        if (requirementId) {
                            window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${requirementId}`;
                        } else {
                            window.location.href = '/pages/home/requirement/view-requirement.html';
                        }
                    }
                );
            } else {
                // Show error with details
                let errorDetails = '';
                if (data.errors) {
                    errorDetails = Object.entries(data.errors)
                        .map(([field, message]) => `${field}: ${message}`)
                        .join('<br>');
                }

                responseModal.showError(
                    "Creation Failed",
                    data.message || "Failed to create requirement",
                    errorDetails
                );

                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Requirement';
            }
        } catch (error) {
            console.error('Error creating requirement:', error);
            responseModal.showError(
                "Error",
                "An error occurred while creating the requirement",
                error.message
            );

            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Requirement';
        }
    }
});

/**
 * Helper function to escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
