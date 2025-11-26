import '/js/utils/core.js';
import '/scss/pages/auth/register.scss';
import { Popover } from 'bootstrap';
import { auth } from "/js/utils/firebaseAuth.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getCurrentSession } from '/js/utils/sessionManager';

async function initRegister() {
    const userData = await getCurrentSession();

    if (userData) {
        window.location.href = "/pages/home/home.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initRegister();

    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.querySelector("#firstNameInput").value;
        const lastName = document.querySelector("#lastNameInput").value;
        const displayName = `${firstName} ${lastName}`;
        const idNumber = document.querySelector("#idinput").value;
        const email = document.querySelector("#emailinput").value;
        const password = document.querySelector("#passwordInput").value;
        const password_confirmation = document.querySelector("#confirmPasswordInput").value;

        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                    id_school_number: idNumber
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.errors?.email?.[0] || 'Registration failed');
            }

            console.log('Registration successful:', data);
            window.location.href = '/pages/auth/login.html';
        } catch (error) {
            console.error("Registration error:", error);
            let errorContainer = document.querySelector("#error-msg");
            if (!errorContainer) {
                errorContainer = document.createElement("div");
                errorContainer.id = "error-msg";
                errorContainer.classList.add("alert", "alert-danger", "mt-3");
                form.appendChild(errorContainer);
            }
            errorContainer.textContent = error.message || "Registration failed";
            errorContainer.style.display = "block";
        }
    });
});

// For disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
        new Popover(popover)
    });
