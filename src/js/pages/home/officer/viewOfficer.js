import '/js/utils/core.js';
import '/scss/pages/home/officer/viewOfficer.scss';
import { setSidebar } from '/components/js/sidebar';
import { setupLogout } from "/js/utils/navigation.js";
import 'bootstrap';

document.addEventListener("DOMContentLoaded", async () => {
    initHome();
    await setSidebar();
    setupLogout();
});

export function initHome() {
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
}

const params = new URLSearchParams(window.location.search);
const officerId = params.get("id");
console.log("Viewing details for officer ID:", officerId);

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".officer-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const officerId = card.getAttribute("data-id");
      // Redirect with officer ID in URL
      window.location.href = `/pages/home/officer/view-officer-details.html?id=${officerId}`;
    });
  });
});
