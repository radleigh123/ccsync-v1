import '/js/utils/core.js';
import '/scss/pages/auth/forgot-password.scss';
import { responseModal } from '/js/utils/errorSuccessModal.js';
import { sendPasswordReset } from '/js/utils/api/auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const backLink = document.getElementById('back-link');
    const form = document.getElementById('forgot-password-form');

    if (backLink) {
        backLink.setAttribute('href', document.referrer);
        backLink.onclick = function () {
            history.back();
            return false;
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;

        try {
            const data = await sendPasswordReset(email);

            console.log('Password reset email sent:', data);
            responseModal.showSuccess('Email Sent', 'Password reset email sent! Please check your inbox.', () => {
                window.location.href = '/pages/auth/login.html';
            });
        } catch (error) {
            const errorMessage = error.message;
            responseModal.showError('Error', 'Error: ' + errorMessage);
            console.error('Error during password reset:', error);
        }
    });
});