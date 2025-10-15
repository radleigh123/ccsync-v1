/**
 * Register Member Page Script
 *
 * Handles form submission for registering new members.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        idNumber: document.getElementById('idNumber').value.trim()
    };

    // Basic client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.idNumber) {
        showMessage('All fields are required.', 'danger');
        return;
    }

    if (formData.idNumber.length > 10) {
        showMessage('ID Number must be 10 characters or less.', 'danger');
        return;
    }

    try {
        const response = await fetch('/temp/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('registerForm').reset();
        } else {
            showMessage(result.message, 'danger');
        }
    } catch (error) {
        console.error('Error registering member:', error);
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
