import '/js/utils/core.js';
import '/scss/pages/auth/forgot-password.scss';

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

        /* await sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password Reset Success");
                alert("Password reset email sent! Please check your inbox.");
                window.location.href = "/pages/auth/login.html";
            })
            .catch(e => {
                const errorCode = e.code;
                const errorMessage = e.message;
                alert("Error: " + errorMessage);
            }); */

        try {
            const response = await fetch('http://localhost:8000/api/auth/send-password-reset', {
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
            alert("Password reset email sent! Please check your inbox.");
            window.location.href = '/pages/auth/login.html';
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
            console.error('Error during password reset:', error);
        }
    });
});