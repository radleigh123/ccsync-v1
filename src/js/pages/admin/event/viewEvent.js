import '/js/utils/core.js';
import '/scss/pages/admin/event/viewEvent.scss';
import { setSidebar } from '/components/js/sidebar';
import { setupLogout } from "/js/utils/navigation.js";
import 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setSidebar();
  setupLogout();
    loadEvents();
});

export function initHome() {
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
}

async function loadEvents() {
    try {
        // const response = await fetch("fetch_events.php");
        // const events = await response.json();

        // Events mock data
        const events = [
            { name: "Tech Conference", date: "2023-10-15", attendees: 150, venue: "Auditorium" },
            { name: "Art Workshop", date: "2023-11-05", attendees: 40, venue: "Room 101" },
            { name: "Music Festival", date: "2023-12-20", attendees: 300, venue: "Open Grounds" }
        ];

        const container = document.getElementById("eventContainer");
        container.innerHTML = "";

        if (events.length > 0) {
            events.forEach(event => {
                const card = `
              <div class="col-md-4 col-sm-6 mb-4">
                <div class="card event-card h-100">
                  <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text mb-1"><strong>Date:</strong> ${event.date}</p>
                    <p class="card-text mb-1"><strong>Attendees:</strong> ${event.attendees}</p>
                    <p class="card-text"><strong>Venue:</strong> ${event.venue}</p>
                  </div>
                  <div class="card-footer bg-white border-0">
                    <button class="btn btn-sm btn-primary w-100">View</button>
                    <button class="btn btn-sm btn-warning w-100">Edit</button>
                    <button class="btn btn-sm btn-danger w-100">Delete</button>
                  </div>
                </div>
              </div>
            `;
                container.innerHTML += card;
            });
        } else {
            container.innerHTML = `
            <div class="col-12 text-center text-muted">
              ---------------- Nothing follows ----------------
            </div>
          `;
        }
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}
