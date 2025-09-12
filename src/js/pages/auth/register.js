import '/js/utils/core.js';
import '/scss/pages/auth/register.scss';
import { Popover } from 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.querySelector("#firstNameInput").value;
        const lastName = document.querySelector("#lastNameInput").value;
        const idNumber = document.querySelector("#idinput").value;
        const email = document.querySelector("#emailinput").value;
        const password = document.querySelector("#passwordInput").value;

        try {
            const response = await fetch("http://localhost:80/demo/ccsync/auth/register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    idNumber,
                    email,
                    password
                }),
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/ccsync-v1/pages/auth/login.html";
            } else {
                let errorContainer = document.querySelector("#error-msg");
                if (!errorContainer) {
                    errorContainer = document.createElement("div");
                    errorContainer.id = "error-msg";
                    errorContainer.classList.add("alert", "alert-danger", "mt-3");
                    form.appendChild(errorContainer);
                }
                errorContainer.textContent = data.message || "Registration failed";
            }
        } catch (error) {
            console.error("Registration error:", error);
            let errorContainer = document.querySelector("#error-msg");
            if (!errorContainer) {
                errorContainer = document.createElement("div");
                errorContainer.id = "error-msg";
                errorContainer.classList.add("alert", "alert-danger", "mt-3");
                form.appendChild(errorContainer);
            }
            errorContainer.textContent = "Error connecting to server";
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
