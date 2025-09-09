import '/js/utils/core.js';
import '/scss/pages/auth/forgot-password.scss';
import { auth } from "/js/utils/firebaseAuth.js";
import { sendPasswordResetEmail } from "firebase/auth";

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

        await sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password Reset Success");
                alert("Password reset email sent! Please check your inbox.");
                window.location.href = "/ccsync-v1/pages/auth/login.html";
            })
            .catch(e => {
                const errorCode = e.code;
                const errorMessage = e.message;
                alert("Error: " + errorMessage);
            });
    });
});