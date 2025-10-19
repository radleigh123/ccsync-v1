/**
 * Add Event Page Script
 *
 * Handles form submission for adding new events.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

document.getElementById('addEventForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('eventName').value.trim(),
        event_date: document.getElementById('eventDate').value,
        max_participants: parseInt(document.getElementById('maxParticipants').value),
        venue: document.getElementById('venue').value.trim()
    };

    // Basic client-side validation
    if (!formData.name || !formData.event_date || !formData.max_participants || !formData.venue) {
        showMessage('All fields are required.', 'danger');
        return;
    }

    if (formData.max_participants <= 0) {
        showMessage('Max participants must be greater than 0.', 'danger');
        return;
    }

    try {
        const response = await fetch('/ccsync-api-plain/event/createEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('addEventForm').reset();
        } else {
            showMessage(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        showMessage('An error occurred. Please try again.', 'danger');
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
