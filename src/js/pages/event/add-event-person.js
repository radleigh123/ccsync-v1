/**
 * Add Event Participant Page Script
 *
 * Handles fetching participant information and registering them for events.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

const eventId = new URLSearchParams(window.location.search).get('event_id');

document.getElementById('idNumber').addEventListener('input', async function() {
    const idNumber = this.value.trim();
    if (idNumber.length === 0) {
        document.getElementById('participantInfo').innerHTML = `
            <p class="my-0 align-items-center p-3 py-2 fw-bold">Participant information:</p>
            <div class="card-body">
                Enter an ID number to fetch participant details.
            </div>
        `;
        return;
    }

    try {
        // Placeholder: Fetch participant info based on ID
        const response = await fetch(`/api/participant/${idNumber}`); // Replace with actual API
        if (response.ok) {
            const participant = await response.json();
            document.getElementById('participantInfo').innerHTML = `
                <p class="my-0 align-items-center p-3 py-2 fw-bold">Participant information:</p>
                <div class="card-body">
                    Name: ${participant.name}<br>
                    Email: ${participant.email}
                </div>
            `;
        } else {
            document.getElementById('participantInfo').innerHTML = `
                <p class="my-0 align-items-center p-3 py-2 fw-bold">Participant information:</p>
                <div class="card-body">
                    Participant not found.
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching participant:', error);
        document.getElementById('participantInfo').innerHTML = `
            <p class="my-0 align-items-center p-3 py-2 fw-bold">Participant information:</p>
            <div class="card-body">
                Error fetching participant information.
            </div>
        `;
    }
});

document.getElementById('addParticipantForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const idNumber = document.getElementById('idNumber').value.trim();
    if (!idNumber) {
        alert('ID number is required.');
        return;
    }

    try {
        const response = await fetch('/ccsync-api-plain/event/addParticipant.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ event_id: eventId, participant_id: idNumber })
        });

        const result = await response.json();
        if (result.success) {
            alert('Participant added successfully.');
            window.location.href = '?page=event/view-event';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error adding participant:', error);
        alert('An error occurred.');
    }
});
