import '/js/utils/core.js';
import '/scss/pages/auth/login.scss';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#login-form");
    const errorMsg = document.querySelector("#error-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idNumber = document.querySelector("#idNumberInput").value;
        const password = document.querySelector("#passwordInput").value;

        try {
            console.log(JSON.stringify({ idNumber, password }));
            // TODO: API endpoint
            const response = await fetch("http://localhost:8080/demo/ccsync/auth/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idNumber, password }),
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                // Redirect to home
                window.location.href = "/ccsync-v1/pages/dashboard/dashboard.html";
            } else {
                errorMsg.textContent = data.message || "Login failed";
            }
        } catch (error) {
            errorMsg.textContent = "Error connecting to server";
        }
    });
});

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