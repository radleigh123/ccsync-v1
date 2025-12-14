import '/js/utils/core.js';
import '/scss/pages/auth/forgot-password.scss';
import { responseModal } from '/js/utils/errorSuccessModal.js';

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
            const response = await fetch('https://ccsync-api-master-ll6mte.laravel.cloud/api/auth/send-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            console.log('Password reset email sent:', data);
            responseModal.showSuccess('Email Sent', 'Password reset email sent! Please check your inbox.', () => {
                window.location.href = '/pages/auth/login.html';
            });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            responseModal.showError('Error', 'Error: ' + errorMessage);
            console.error('Error during password reset:', error);
        }
    });
});