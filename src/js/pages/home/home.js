import '/js/utils/core.js';
import '/scss/pages/home/home.scss';
import { setSidebar } from '/components/js/sidebar.js';
import { setupLogout } from "/js/utils/navigation.js";
import { setupFloatingNav } from "/components/js/floating_button.js";
import { setupMobileSidebarToggle } from "/components/js/mobile_sidebar_toggle.js";

export function initHome() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }
    const userData = JSON.parse(user);

    const welcomeEl = document.querySelector("h1");
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${userData.name_first || "User"}!`;
    }

    // Optionally, populate other dashboard data here
    // Example: last sync time, stats, etc.
    // You can add more selectors and assignments as needed
}

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setupLogout();
    setSidebar();
    setupFloatingNav();
    // setupMobileSidebarToggle();
});