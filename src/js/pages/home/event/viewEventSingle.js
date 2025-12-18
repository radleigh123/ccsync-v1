import '/js/utils/core.js';
import '/scss/pages/home/event/viewEventSingle.scss';
import '/scss/confirmationModal.scss';
// import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { confirmationModal } from '/js/utils/confirmationModal.js';
import { responseModal } from '/js/utils/errorSuccessModal.js';
import { shimmerLoader } from '/js/utils/shimmerLoader.js';
import { getYearSuffix, formatDate } from '/js/utils/date.js';
import { setupLogout } from '/js/utils/navigation.js';
import { fetchEvent } from "/js/utils/api.js";
import { fetchEventParticipants } from "/js/utils/api.js";

let userData = null;
let selectedEvent = null;
let allParticipants = [];
let currentPage = 1;
let currentLimit = 20;
let paginationData = null;

// Get event_id from URL
const eventId = new URLSearchParams(window.location.search).get('event_id');

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    // setSidebar();
    setupLogout();

    // Setup back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/pages/home/event/view-event.html';
        });
    }

    // Setup edit event button
    const editBtn = document.getElementById('editEventBtn');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (eventId) {
                window.location.href = `/pages/home/event/edit-event.html?event_id=${eventId}`;
            }
        });
    }

    // Setup add participant button
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (eventId) {
                window.location.href = `/pages/home/event/add-event-person.html?event_id=${eventId}`;
            }
        });
    }

    // Setup pagination buttons
    setupPaginationButtons();

    // Load event data
    await loadEventData();
    await loadParticipants();
});

async function initHome() {
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

/**
 * Load event data from API
 */
async function loadEventData() {
    if (!eventId) {
        console.error('No event ID provided');
        return;
    }

    try {
        console.log('📥 Loading event data for ID:', eventId);

        // TODO: Manual call, merge all fetches in one file
        /* const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/events/${eventId}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        ); */
        const response = await fetchEvent(eventId);

        if (!response.success) {
            console.error('Failed to load event');
            return;
        }

        const event = response.data;

        populateEventInfo(event);

    } catch (error) {
        console.error('❌ Error loading event data:', error);
    }
}

/**
 * Load participants with pagination
 */
async function loadParticipants(page = 1) {
    if (!eventId) return;

    try {
        console.log('📥 Loading participants for event:', eventId, 'page:', page);

        /* const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/events/${eventId}/members?page=${page}&per_page=${currentLimit}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        ); */
        const response = await fetchEventParticipants(eventId, page, currentLimit);

        if (response.data?.members === undefined) {
            const errorData = await response.json();
            console.error('❌ Failed to load participants:', response.status, errorData);
            displayParticipants([]);
            shimmerLoader.hide("#shimmerTable", 300);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 300);
            return;
        }

        if (response) {
            allParticipants = response.data;
            paginationData = response;
            currentPage = paginationData.meta.current_page;

            displayParticipants(allParticipants);
            updatePaginationControls();

            console.log('✅ Participants loaded:', allParticipants);

            // Update available slots in event info
            if (selectedEvent) {
                populateEventInfo(selectedEvent);
            }

            // Hide shimmer and show table
            shimmerLoader.hide("#shimmerTable", 600);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 600);
        } else {
            displayParticipants([]);
            shimmerLoader.hide("#shimmerTable", 300);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 300);
        }
    } catch (error) {
        console.error('❌ Error loading participants:', error);
        displayParticipants([]);
        shimmerLoader.hide("#shimmerTable", 300);
        setTimeout(() => {
            document.getElementById("shimmerTable").style.display = "none";
            document.getElementById("dataTable").style.display = "table";
        }, 300);
    }
}

/**
 * Populate event information on the page
 */
function populateEventInfo(event) {
    document.getElementById('eventName').textContent = event.name || '-';
    document.getElementById('eventVenue').textContent = event.venue || '-';
    document.getElementById('eventDate').textContent = formatDate(event.event_date) || '-';
    document.getElementById('eventMaxParticipants').textContent = event.max_participants || '-';

    // Calculate available slots
    const registered = allParticipants.length;
    const available = Math.max(0, (event.max_participants || 0) - registered);
    document.getElementById('eventAvailableSlots').textContent = available;

    document.getElementById('eventRegistrationEnd').textContent = formatDate(event.registration_end) || '-';
}

/**
 * Display participants in table
 */
function displayParticipants(participants) {
    const tbody = document.getElementById('participantsTableBody');
    const countElement = document.getElementById('participantCount');

    tbody.innerHTML = '';

    // Update the participant count
    if (countElement) {
        countElement.textContent = participants?.meta?.count;
    }

    if (!participants || participants?.length == 0 || participants.members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No participants registered</td></tr>';
        return;
    }

    participants?.members.forEach((participant) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.first_name} ${participant.last_name}</td>
            <td>${participant.year + getYearSuffix(participant.year)}</td>
            <td>${participant.program || '-'}</td>
            <td>${formatDate(participant.registered_at) || '-'}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary mark-attended-btn" data-participant-id="${participant.id}" title="Mark as attended">
                        <i class="bi bi-check-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-participant-btn" data-participant-id="${participant.id}" title="Remove participant">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Setup event listeners for action buttons
    setupParticipantActions();
}

/**
 * Setup event listeners for participant action buttons
 */
function setupParticipantActions() {
    // Mark attended buttons
    document.querySelectorAll('.mark-attended-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const participantId = btn.dataset.participantId;
            const participant = allParticipants.find(p => p.id == participantId);
            if (participant) {
                const participantName = `${participant.first_name} ${participant.last_name}`;
                showMarkAttendedConfirmation(participantId, participantName);
            }
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-participant-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const participantId = btn.dataset.participantId;
            const participant = allParticipants.find(p => p.id == participantId);
            if (participant) {
                const participantName = `${participant.first_name} ${participant.last_name}`;
                showRemoveConfirmation(participantId, participantName);
            }
        });
    });
}

/**
 * Setup pagination buttons
 */
function setupPaginationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (paginationData && paginationData.links.prev) {
                console.log("currentPage", currentPage);
                loadParticipants(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (paginationData && paginationData.links.next) {
                console.log("currentPage", currentPage);
                loadParticipants(currentPage + 1);
            }
        });
    }
}

/**
 * Update pagination controls
 */
function updatePaginationControls() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    if (paginationData) {
        // Update button states
        if (prevBtn) prevBtn.disabled = !paginationData.links.prev;
        if (nextBtn) nextBtn.disabled = !paginationData.links.next;

        // Update page info display
        if (pageInfo) {
            pageInfo.textContent = `Page ${paginationData.meta.current_page} of ${paginationData.meta.last_page} (${paginationData.meta.total} total participants)`;
        }
    }
}

/**
 * Show confirmation modal for marking participant as attended
 */
function showMarkAttendedConfirmation(participantId, participantName) {
    confirmationModal.show(
        'Mark as Attended',
        `Mark ${participantName} as attended for this event?`,
        {
            onYes: () => markParticipantAttended(participantId),
            onNo: () => console.log('Cancelled marking attended')
        }
    );
}

/**
 * Show confirmation modal for removing participant
 */
function showRemoveConfirmation(participantId, participantName) {
    confirmationModal.show(
        'Remove Participant',
        `Remove ${participantName} from this event's attendee list?`,
        {
            onYes: () => removeParticipant(participantId),
            onNo: () => console.log('Cancelled remove')
        }
    );
}

/**
 * Mark participant as attended
 */
async function markParticipantAttended(participantId) {
    try {
        console.log('📤 Marking participant as attended:', participantId);

        const response = await fetch(
            '/ccsync-api-plain/event/markAttended',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    event_id: eventId,
                    participant_id: participantId
                })
            }
        );

        if (!response.ok) {
            console.error('Failed to mark attended');
            responseModal.showError('Error', 'Failed to mark as attended');
            return;
        }

        const data = await response.json();
        if (data.success) {
            console.log('✅ Participant marked as attended');
            // Reload participants list (stay on current page)
            await loadParticipants(currentPage);
        } else {
            responseModal.showError('Error', data.message || 'Failed to mark as attended');
        }
    } catch (error) {
        console.error('❌ Error marking attended:', error);
        responseModal.showError('Error', 'Error marking participant as attended');
    }
}

/**
 * Remove participant from event
 */
async function removeParticipant(participantId) {
    try {
        console.log('📤 Removing participant:', participantId);

        const response = await fetch(
            `/ccsync-api-plain/event/removeParticipant?event_id=${eventId}&participant_id=${participantId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }
            }
        );

        if (!response.ok) {
            console.error('Failed to remove participant');
            responseModal.showError('Error', 'Failed to remove participant');
            return;
        }

        const data = await response.json();
        if (data.success) {
            console.log('✅ Participant removed');
            // Reload participants list (stay on current page, or go back if last item removed)
            const newPage = allParticipants.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            await loadParticipants(newPage);
        } else {
            responseModal.showError('Error', data.message || 'Failed to remove participant');
        }
    } catch (error) {
        console.error('❌ Error removing participant:', error);
        responseModal.showError('Error', 'Error removing participant');
    }
}
