import '/js/utils/core.js';
import { setSidebar } from '/components/js/sidebar';
import '/scss/pages/admin/event/addEvent.scss';
import 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setSidebar();
});

export function initHome() {
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
}
