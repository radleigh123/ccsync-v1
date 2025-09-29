import '/js/utils/core.js';
import '/scss/pages/home/event/addEventPerson.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    setSidebar();
});

async function initHome() {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/ccsync-v1/pages/auth/login.html";
}