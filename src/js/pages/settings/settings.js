import '/js/utils/core.js';
import '/scss/pages/settings/settings.scss';
import { setSidebar } from "/js/utils/components/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";
import { setupFloatingNav } from '../../utils/components/floating_button';

export function initSettings() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }
    const userData = JSON.parse(user);
}

document.addEventListener("DOMContentLoaded", () => {
    initSettings();
    setupLogout();
    setSidebar();
    setupFloatingNav();
})