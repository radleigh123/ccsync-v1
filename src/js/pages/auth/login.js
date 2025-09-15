import '/js/utils/core.js';
import '/scss/pages/auth/login.scss';
import { auth } from "/js/utils/firebaseAuth.js";
import { signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#login-form");
    const errorMsg = document.querySelector("#error-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#emailInput").value;
        const password = document.querySelector("#passwordInput").value;

        /* try {
            console.log(JSON.stringify({ idNumber, password }));
            // TODO: API endpoint
            const response = await fetch("http://localhost:80/demo/ccsync/auth/login.php", {
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
                window.location.href = "/ccsync-v1/pages/home/home.html";
            } else {
                errorMsg.textContent = data.message || "Login failed";
            }
        } catch (error) {
            errorMsg.textContent = "Error connecting to server";
        } */
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('SUCESSFUL LOGIN');

                const user = userCredentials.user;
                console.log(user);
                // TODO: For now store user in Local Storage
                localStorage.setItem("user", JSON.stringify(user));

                window.location.href = "/ccsync-v1/pages/home/home.html";
            })
            .catch(e => {
                const errorCode = e.code;
                errorMsg.textContent = e.message;
            });
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