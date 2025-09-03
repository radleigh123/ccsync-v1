import '/js/utils/core.js';
import '/scss/pages/settings/settings.scss';
import { setSidebar } from "/js/utils/components/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";

export function initSettings() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }
    const userData = JSON.parse(user);
}

document.addEventListener("DOMContentLoaded", setSidebar);
document.addEventListener("DOMContentLoaded", setupLogout);
document.addEventListener("DOMContentLoaded", initSettings);