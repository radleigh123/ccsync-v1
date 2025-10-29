import '/js/utils/core.js';
import '/scss/pages/home/requirement/viewRequirement.scss';
import { setSidebar } from '/components/js/sidebar';
import { setupLogout } from "/js/utils/navigation.js";
import { shimmerLoader } from '/js/utils/shimmerLoader';
import 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setSidebar();
    setupLogout();
    
    // Hide shimmer and show data table after page initialization
    shimmerLoader.hide("#shimmerTable", 600);
    setTimeout(() => {
      document.getElementById("shimmerTable").style.display = "none";
      document.getElementById("dataTable").style.display = "table";
    }, 600);
});

export function initHome() {
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
}
