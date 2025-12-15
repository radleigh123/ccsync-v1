import '/js/utils/core.js';
import '/scss/pages/home/event/addEventPerson.scss';
// import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { getYearSuffix } from '/js/utils/date';
import { responseModal } from '/js/utils/errorSuccessModal.js';
import { confirmationModal } from '/js/utils/confirmationModal.js';
import { setupLogout } from '/js/utils/navigation.js';

let userData = null;
let selectedEventId = null; // Store the database event ID
let selectedMemberId = null; // Store the database member ID
let searchTimeout = null; // Debounce timer for search

// Read event_id from URL parameters
const eventId = new URLSearchParams(window.location.search).get('event_id');

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    // setSidebar();
    setupLogout();
    await loadEventData();
    setupFormHandlers();
});

async function initHome() {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

/**
 * Load event data from API and display in form
 */
async function loadEventData() {
    if (!eventId) {
        console.error('No event ID provided');
        showError('Event ID not found. Please select an event first.');
        return;
    }

    try {
        const eventId = new URLSearchParams(window.location.search).get('event_id');
        selectedEventId = eventId;

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
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const event = data.data;

        if (event) {
            // Update event information in the form
            document.getElementById('eventCardTitle').textContent = event.name;
            document.getElementById('eventSubtitle').textContent = `Register a participant for: ${event.name}`;
            document.getElementById('eventCardDate').textContent = `Event Date: ${event.event_date}`;
            console.log('Event data loaded successfully:', event);
        } else {
            showError('Unable to load events. Please try again.');
        }
    } catch (error) {
        console.error('Error loading event data:', error);
        showError('Error loading event information. Please try again.');
    }
}

/**
 * Setup form event handlers
 */
function setupFormHandlers() {
    const participantForm = document.getElementById('participantForm');
    const idNumberInput = document.getElementById('idNumber');
    const participantInfoSection = document.getElementById('participantInfoSection');
    const registerButton = document.getElementById('registerButton');

    // Listen for ID number input changes with debouncing
    idNumberInput.addEventListener('input', async (e) => {
        const idNumber = e.target.value.trim();

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (idNumber.length === 0) {
            participantInfoSection.style.display = 'none';
            registerButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Only search for exact numeric matches (ID should be all digits)
        if (!/^\d+$/.test(idNumber)) {
            participantInfoSection.style.display = 'none';
            registerButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Require full 8-digit school ID before searching
        if (idNumber.length < 8) {
            participantInfoSection.style.display = 'none';
            registerButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Debounce the search - wait 500ms after user stops typing
        searchTimeout = setTimeout(async () => {
            await loadParticipantInfo(idNumber);
        }, 500);
    });

    // Also allow Enter key to trigger immediate search
    idNumberInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const idNumber = idNumberInput.value.trim();

            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            if (idNumber.length === 0) {
                responseModal.showError('Invalid ID Number', 'Please enter a valid ID number');
                return;
            }

            if (!/^\d+$/.test(idNumber)) {
                responseModal.showError('Invalid ID Number', 'ID number must contain only digits');
                return;
            }

            // Require exactly 8 digits for school ID
            if (idNumber.length !== 8) {
                responseModal.showError('Invalid ID Number', 'School ID number must be exactly 8 digits');
                return;
            }

            await loadParticipantInfo(idNumber);
        }
    });

    // Handle form submission
    participantForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await registerParticipant();
    });
}

/**
 * Load and display participant information
 */
async function loadParticipantInfo(memberIdSchoolNumber) {
    try {
        // Show participant info section with shimmer loader
        const participantInfoSection = document.getElementById('participantInfoSection');
        const shimmerLoader = document.getElementById('participantInfoShimmer');
        const participantCard = document.getElementById('participantCard');

        participantInfoSection.style.display = 'block';
        shimmerLoader.style.display = 'block';
        participantCard.style.display = 'none';

        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/members/member?id_school_number=${memberIdSchoolNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            shimmerLoader.style.display = 'none';
            participantInfoSection.style.display = 'none';
            showParticipantError('Member not found0');
            return;
        }

        const data = await response.json();

        console.log(data);

        if (!data?.data) {
            shimmerLoader.style.display = 'none';
            participantInfoSection.style.display = 'none';
            showParticipantError('Member not found');
            return;
        }

        const member = data.data;

        if (member) {
            // Store the member database ID for registration
            selectedMemberId = member.id;

            // Determine registration status
            const isAlreadyRegistered = await checkIfAlreadyRegistered(selectedMemberId);
            const registrationStatusHTML = isAlreadyRegistered ?
                '<span class="badge bg-warning">Already Registered</span>' :
                '<span class="badge bg-success">Not Registered</span>';

            // Display participant information
            document.getElementById('participantRegistrationStatus').innerHTML = registrationStatusHTML;
            document.getElementById('participantName').textContent =
                `${member.first_name} ${member.last_name}`;
            document.getElementById('participantEmail').textContent = member?.user.email;
            document.getElementById('participantProgram').textContent = member.program;
            document.getElementById('participantYear').textContent =
                `${member.year}${getYearSuffix(member.year)}`;

            // Hide shimmer, show actual card
            shimmerLoader.style.display = 'none';
            participantCard.style.display = 'block';

            // Enable/disable register button based on registration status
            document.getElementById('registerButton').disabled = isAlreadyRegistered;
            if (isAlreadyRegistered) {
                document.getElementById('registerButton').textContent = 'Already Registered';
            } else {
                document.getElementById('registerButton').textContent = 'Register Participant';
            }

            console.log('Participant data loaded:', member);
        } else {
            shimmerLoader.style.display = 'none';
            participantInfoSection.style.display = 'none';
            showParticipantError('Member not found2');
        }
    } catch (error) {
        console.error('Error loading participant info:', error);
        document.getElementById('participantInfoSection').style.display = 'none';
        document.getElementById('participantInfoShimmer').style.display = 'none';
        showParticipantError('Error loading member information');
    }
}

/**
 * Check if member is already registered for this event
 * Checks: event_registrations WHERE event_id = selectedEvent.id AND member_id = memberId
 * Return an Event object, if member is already register.
 */
async function checkIfAlreadyRegistered(memberId) {
    try {
        const eventId = new URLSearchParams(window.location.search).get('event_id');

        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/members/${memberId}/check?event_id=${eventId}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error('Failed to check registration status');
            return false;
        }

        const data = await response.json();

        return data.data.length > 0;
    } catch (error) {
        console.error('Error checking registration status:', error);
        return false;
    }
}

/**
 * Register participant for event
 */
async function registerParticipant() {
    if (!selectedMemberId || !selectedEventId) {
        responseModal.showError('Missing Information', 'Please provide all required information');
        return;
    }

    try {
        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/events/${selectedEventId}/add`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    member_id: selectedMemberId,  // Use the stored member database ID
                }),
            }
        );

        const data = await response.json();

        console.log(data);


        if (response.ok) {
            console.log(response.ok);
            responseModal.showSuccess(
                'Participant Registered',
                'The participant has been successfully registered for this event.',
                null,
                () => {
                    // Redirect back to view events after modal closes
                    window.location.href = '/pages/home/event/view-event.html';
                });
        } else {
            console.log(`ERROR:`, response.ok);
            responseModal.showError(
                'Registration Failed',
                data.message || 'Failed to register participant'
            );
        }
    } catch (error) {
        console.error('Error registering participant:', error);
        responseModal.showError(
            'Error',
            'An error occurred while registering the participant'
        );
    }
}

/**
 * Show participant-specific error message
 */
function showParticipantError(message) {
    document.getElementById('participantInfoSection').style.display = 'none';
    document.getElementById('registerButton').disabled = true;
    document.getElementById('statusMessage').style.display = 'block';
    document.getElementById('statusText').textContent = `Error: ${message}`;
}

/**
 * Show general error message
 */
function showError(message) {
    const statusDiv = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    statusDiv.style.display = 'block';
    statusDiv.className = 'alert alert-danger mb-4';
    statusText.textContent = `Error: ${message}`;
}