import "/js/utils/core.js";
import "/scss/pages/auth/login.scss";
import { auth } from "/js/utils/firebaseAuth.js";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getCurrentSession } from "/js/utils/sessionManager";

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

async function initLogin() {
  const userData = await getCurrentSession();

  if (userData) {
    window.location.href = "/pages/home/home.html";
  }
}

import { login } from '/js/utils/api/auth.js';

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

      const data = await login(email, password);
      console.log(data);

      try {
        await signInWithEmailAndPassword(auth, email, password);
        idToken = await auth.currentUser.getIdToken();
      } catch (error) {
        console.warn(
          "Firebase client sign-in failed, falling back to server token",
          error
        );
        idToken = data?.firebase_user?.idToken;
      }

      const userData = {
        ...data.user,
        firebase_token: idToken,
        last_login: new Date().toISOString(),
      };
      console.log("Verified user: ", userData);
      localStorage.setItem("user", JSON.stringify(userData));

      window.location.href = "/pages/home/home.html";
    } catch (error) {
      errorMsg.textContent = error.message;
      console.error("Error during login: ", error);
    }
  });
});

(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
