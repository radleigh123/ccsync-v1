import '/js/utils/core.js';
import '/scss/pages/home/event/editEvent.scss';
import '/scss/formValidator.scss';
import '/scss/errorSuccessModal.scss';
// import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { updateEvent } from '/js/utils/api.js';
import { FormValidator } from '/js/utils/formValidator.js';
import { responseModal } from '/js/utils/errorSuccessModal.js';
import { parseTime, parseDate } from "/js/utils/date.js";
import { setupLogout } from '/js/utils/navigation.js';

let userData = null;
let formValidator = null;
let selectedEvent = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    // setSidebar();
    setupLogout();

    const form = document.getElementById("editEventForm");

    // Initialize FormValidator for inline validation
    // This automatically sets up blur/input/change listeners on all [data-validate] fields
    formValidator = new FormValidator(form);

    console.log('✅ FormValidator initialized');

    // Setup back button navigation
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", (e) => {
            e.preventDefault();
            const eventId = new URLSearchParams(window.location.search).get('event_id');
            if (eventId) {
                window.location.href = `/pages/home/event/view-event.html?event_id=${eventId}`;
            } else {
                window.location.href = '/pages/home/event/view-event.html';
            }
        });
    }

    // Load event data from API
    await loadEventData();

    // Handle form submission
    form.addEventListener("submit", handleSubmit);
});

async function initHome() {
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadEventData() {
    try {
        const eventId = new URLSearchParams(window.location.search).get('event_id');

        if (!eventId) {
            responseModal.showError('Error', 'No event ID provided');
            return;
        }

        console.log('📥 Loading event data for ID:', eventId);

        // Fetch all events from API
        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/events/${eventId}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            responseModal.showError('Error', 'Failed to load events');
            return;
        }

        const data = await response.json();
        const event = data.data;

        if (!event) {
            responseModal.showError('Error', 'Event not found');
            return;
        }

        selectedEvent = event;
        populateForm(event);
        console.log('✅ Event data loaded:', event);

    } catch (error) {
        console.error('❌ Error loading event data:', error);
        responseModal.showError('Error', 'Failed to load event data: ' + error.message);
    }
}

function populateForm(event) {
    document.getElementById('eventName').value = event.name || '';
    document.getElementById('venue').value = event.venue || '';
    document.getElementById('description').value = event.description || '';
    document.getElementById('eventDate').value = event.event_date || '';
    document.getElementById('fromTime').value = event.time_from || '';
    document.getElementById('toTime').value = event.time_to || '';
    document.getElementById('registrationStart').value = event.registration_start || '';
    document.getElementById('registrationEnd').value = event.registration_end || '';
    document.getElementById('maxParticipants').value = event.max_participants || '';

    // DON'T validate here - let the blur/input listeners handle it
    // Initial values are likely valid anyway, so this just adds noise
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

    // Today's date at midnight for comparison (local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDateObj = parseDate(eventDate);

    // Validation 1: Event date must be in the future (not today, not past)
    if (eventDateObj <= today) {
        responseModal.showError("Invalid Event Date", "Event date must be in the future (cannot be today or earlier)");
        return;
    }

    // Validation 2: If registration start is provided
    if (registrationStart) {
        const regStartDateObj = parseDate(registrationStart);

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
            const regEndDateObj = parseDate(registrationEnd);

            // Registration end must be after registration start
            if (regEndDateObj <= regStartDateObj) {
                responseModal.showError("Invalid Registration Date", "Registration end must be after registration start date");
                return;
            }
        }
    }

    try {
        const eventId = new URLSearchParams(window.location.search).get('event_id');

        if (!eventName || !eventDate || !timeFrom || !timeTo || !venue) {
            throw new Error("Required fields missing");
        }

        const payload = {
            name: eventName,
            description: description || '',
            venue: venue,
            event_date: eventDate,
            time_from: parseTime(timeFrom),
            time_to: parseTime(timeTo),
            registration_start: registrationStart || null,
            registration_end: registrationEnd || null,
            max_participants: maxParticipants ? parseInt(maxParticipants) : 9999,
            status: selectedEvent.status
        };

        // Note: this returns JSON not a Response object
        const response = await updateEvent(eventId, payload); // BROKEN

        /* const response = await fetch(`https://ccsync-api-master-ll6mte.laravel.cloud/api/events/${eventId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${userData.firebase_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        console.log(await response.json()); */

        // Note: If Response object, `response.ok` status is enough if api worked
        // Temporary check statement, since return response is in JSON format
        if (response.success === true) {
            // console.log("✓ Event updated successfully:", response.data);
            responseModal.showSuccess("Success!", "Event updated successfully!", null, () => {
                window.location.href = `/pages/home/event/view-event.html?event_id=${eventId}`;
            });
        } else {
            throw new Error(response.message || "Failed to update event");
        }
    } catch (error) {
        const message = error;
        console.error("❌ Error updating event:", message);
        responseModal.showError("Error Updating Event", message || "An unexpected error occurred");
    }
}
