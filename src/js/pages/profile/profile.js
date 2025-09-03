import '/js/utils/core.js';
import '/scss/pages/profile/profile.scss';
import { setSidebar } from "/js/utils/components/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";

export function initProfile() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    } else {
        // TODO: API please
        const userData = JSON.parse(user);
        const nameEl = document.querySelector("#user-name-full");
        const emailEl = document.querySelector("#user-email");
        const imgEl = document.querySelector("#img-profile");

        if (nameEl) nameEl.textContent = userData.name_first + " " + userData.name_last;
        if (emailEl) emailEl.textContent = userData.email;

        if (userData.role == "ADMIN" && imgEl) {
            imgEl.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfJd8GSrBKC5rkiuwyqorIs8LJboDjI2IYw&s";
        }
    }

    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
}

document.addEventListener("DOMContentLoaded", setSidebar);
document.addEventListener("DOMContentLoaded", setupLogout);
document.addEventListener("DOMContentLoaded", initProfile);
