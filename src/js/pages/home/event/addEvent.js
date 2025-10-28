import '/js/utils/core.js';
import '/scss/pages/home/event/addEvent.scss';
import '/scss/errorSuccessModal.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { createEvent } from '/js/utils/api.js';
import { FormValidator } from '/js/utils/formValidator.js';
import { responseModal } from '/js/utils/errorSuccessModal.js';

let userData = null;
let formValidator = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    setSidebar();

    const form = document.getElementById("addEventForm");
    
    // Initialize FormValidator for inline validation
    formValidator = new FormValidator(form);
    
    // Handle form submission
    form.addEventListener("submit", handleSubmit);
});

async function initHome() {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

async function handleSubmit(event) {
    event.preventDefault();

    // Validate the form using FormValidator
    if (!formValidator.validateForm()) {
        console.log("❌ Form validation failed - please fix the highlighted fields");
        return;
    }

    // Get form values
    const eventName = document.getElementById("eventName").value.trim();
    const eventDate = document.getElementById("eventDate").value;
    const timeFrom = document.getElementById("fromTime").value;
    const timeTo = document.getElementById("toTime").value;
    const venue = document.getElementById("venue").value.trim();
    const description = document.getElementById("description").value.trim();
    const registrationStart = document.getElementById("registrationStart").value;
    const registrationEnd = document.getElementById("registrationEnd").value;
    const maxParticipants = document.getElementById("maxParticipants").value.trim();

    // ===== ADVANCED DATE VALIDATIONS =====
    
    // Helper function to parse date string (YYYY-MM-DD) to local midnight Date object
    const parseDateString = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, parseInt(month) - 1, day, 0, 0, 0, 0);
        return date;
    };
    
    // Today's date at midnight for comparison (local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDateObj = parseDateString(eventDate);

    // Validation 1: Event date must be in the future (not today, not past)
    if (eventDateObj <= today) {
        responseModal.showError("Invalid Event Date", "Event date must be in the future (cannot be today or earlier)");
        return;
    }

    // Validation 2: If registration start is provided
    if (registrationStart) {
        const regStartDateObj = parseDateString(registrationStart);

        // Registration start cannot be before or on today
        if (regStartDateObj <= today) {
            responseModal.showError("Invalid Registration Date", "Registration start date cannot be today or in the past");
            return;
        }

        // Registration start cannot be on the same day as event date
        if (regStartDateObj.getTime() === eventDateObj.getTime()) {
            responseModal.showError("Invalid Registration Date", "Registration start cannot be on the same day as the event");
            return;
        }

        // Registration start must be before event date
        if (regStartDateObj >= eventDateObj) {
            responseModal.showError("Invalid Registration Date", "Registration start cannot be after or on the event date");
            return;
        }

        // Validation 3: If both registration start and end are provided
        if (registrationEnd) {
            const regEndDateObj = parseDateString(registrationEnd);

            // Registration end must be after registration start
            if (regEndDateObj <= regStartDateObj) {
                responseModal.showError("Invalid Registration Date", "Registration end must be after registration start date");
                return;
            }
        }
    }

    try {
        console.log("📝 Creating event:", {
            name: eventName,
            event_date: eventDate,
            venue: venue,
            time_from: timeFrom,
            time_to: timeTo,
            registration_start: registrationStart || null,
            registration_end: registrationEnd || null
        });

        // Call the API utility function
        const response = await createEvent({
            name: eventName,
            description: description,
            venue: venue,
            event_date: eventDate,
            time_from: timeFrom,
            time_to: timeTo,
            registration_start: registrationStart || null,
            registration_end: registrationEnd || null,
            max_participants: maxParticipants ? parseInt(maxParticipants) : null,
            status: "open"
        });

        if (response.success) {
            console.log("✓ Event created successfully:", response.event);
            responseModal.showSuccess("Success!", "Event created successfully!", null, () => {
                window.location.href = "/pages/home/event/view-event.html";
            });
        } else {
            throw new Error(response.message || "Failed to create event");
        }
    } catch (error) {
        console.error("❌ Error adding event:", error);
        responseModal.showError("Error Creating Event", error.message || "An unexpected error occurred");
    }
}

/**
 * Show error modal with user-friendly message
 */
function showErrorModal(title, message) {
    responseModal.showError(title, message);
}

/**
 * Show success modal with user-friendly message
 */
function showSuccessModal(title, message, callback) {
    responseModal.showSuccess(title, message, null, callback);
}
