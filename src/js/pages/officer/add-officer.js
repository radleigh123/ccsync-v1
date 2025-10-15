/**
 * Add Officer Page Script
 *
 * Handles form submission for adding new officers.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

document.getElementById('addOfficerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        position: document.getElementById('position').value.trim()
    };

    // Basic client-side validation
    if (!formData.name || !formData.position) {
        showMessage('All fields are required.', 'danger');
        return;
    }

    try {
        const response = await fetch('/ccsync-api-plain/officer/createOfficer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('addOfficerForm').reset();
        } else {
            showMessage(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error adding officer:', error);
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
