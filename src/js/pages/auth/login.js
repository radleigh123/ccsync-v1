import '/js/utils/core.js';
import '/scss/pages/auth/login.scss';
import { auth } from "/js/utils/firebaseAuth.js";
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { getCurrentSession } from '/js/utils/sessionManager';
import { user as mockUser } from '/js/utils/mock/data.js';

setPersistence(auth, browserLocalPersistence).catch(error => {
    console.error("Error setting persistence:", error);
});

async function initLogin() {
    const userData = await getCurrentSession();

    if (userData) {
        window.location.href = "/pages/home/home.html";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initLogin();

    const form = document.querySelector("#login-form");
    const errorMsg = document.querySelector("#error-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#emailInput").value;
        const password = document.querySelector("#passwordInput").value;

        try {
            let idToken = null;

            if (import.meta.env.DEV) {
                signInWithEmailAndPassword(auth, email, password)
                    .then(async userCredentials => {
                        idToken = await userCredentials.user.getIdToken();
                        return idToken;
                    })
                    .then(data => {
                        console.log('Mock login in development mode. ID Token: ', idToken);
                        const userData = {
                            ...mockUser,
                            firebase_token: idToken,
                            last_login: new Date().toISOString()
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                        window.location.href = '/pages/home/home.html';
                    })
                    .catch(error => {
                        const errorCode = error.code;
                        errorMsg.textContent = error.message;
                        console.error('Error during login: ', error);
                    });
            } else {
                // TODO: Maybe let backend handle this firebase login method
                signInWithEmailAndPassword(auth, email, password)
                    .then(async userCredentials => {
                        idToken = await userCredentials.user.getIdToken();
                        return idToken;
                    })
                    .then(idToken => {
                        return fetch('http://localhost:8000/api/auth/verify-token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({ id_token: idToken }),
                        });
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Verified user: ', data);
                        const userData = {
                            ...data.user,
                            firebase_token: idToken,
                            last_login: new Date().toISOString()
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                        window.location.href = '/pages/home/home.html';
                    })
                    .catch(error => {
                        const errorCode = error.code;
                        errorMsg.textContent = error.message;
                        console.error('Error during token verification: ', error);
                    });
            }
        } catch (error) {
            errorMsg.textContent = error.message;
            console.error('Error during login: ', error);
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