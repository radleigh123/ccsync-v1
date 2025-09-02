import '/js/utils/core.js';
import '/scss/pages/home/home.scss';

export function initHome() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }
    const userData = JSON.parse(user);

    // Set user name in welcome message
    const welcomeEl = document.querySelector("h1");
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${userData.name_first || "User"}!`;
    }

    // Optionally, populate other dashboard data here
    // Example: last sync time, stats, etc.
    // You can add more selectors and assignments as needed
}

// If loaded directly, run init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initHome);
} else {
    initHome();
}