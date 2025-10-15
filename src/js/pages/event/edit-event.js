/**
 * Edit Event Page Script
 *
 * Handles form submission for editing events.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

const eventId = new URLSearchParams(window.location.search).get('event_id');

document.getElementById('editEventForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        id: eventId,
        name: document.getElementById('eventName').value.trim(),
        event_date: document.getElementById('eventDate').value,
        max_participants: parseInt(document.getElementById('maxParticipants').value),
        venue: document.getElementById('venue').value.trim()
    };

    // Basic validation
    if (!formData.name || !formData.event_date || !formData.max_participants || !formData.venue) {
        showMessage('All fields are required.', 'danger');
        return;
    }

    try {
        const response = await fetch('/ccsync-api-plain/event/updateEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            showMessage('Event updated successfully.', 'success');
        } else {
            showMessage(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error updating event:', error);
        showMessage('An error occurred.', 'danger');
    }
});

/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message (success, danger, etc.).
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
