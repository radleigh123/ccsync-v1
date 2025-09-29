import '/js/utils/core.js';
import '/scss/pages/home/event/viewEvent.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  setSidebar();
  loadEvents();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/ccsync-v1/pages/auth/login.html";
}

async function loadEvents() {
  try {
    // const response = await fetch("fetch_events.php");
    // const events = await response.json();

    // Events mock data
    const events = [
      { title: "CCS Acquaintance Party", date: "2024-07-01 10:00 AM", description: "A casual gathering to get to know each other.", attendees: 9999, venue: "Room 219" },
      { title: "Intramurals", date: "2024-07-05 11:59 PM", description: "A friendly sports competition between teams.", attendees: 150, venue: "Auditorium" },
    ];

    displayEvents(events);

  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

function displayEvents(events) {
  const container = document.getElementById("eventContainer");
  container.className += " gap-4";
  container.innerHTML = "";

  if (events.length > 0) {
    events.forEach(event => {
      const card = document.createElement("div");
      card.id = "eventCardItem";
      card.className = "card px-0 col-md-4 col-sm-6 mb-4";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body d-flex flex-column justify-content-between";
      cardBody.innerHTML = `
          <h5 class="card-title text-center flex-fill align-content-center">${event.title}</h5>
          <hr />
          <div class="d-flex flex-row gap-2">
            <strong>Date:</strong>
            <p id="eventCardDate" class="my-0">${event.date}</p>
          </div>
          <div class="d-flex flex-row gap-2">
            <strong>Attendees:</strong>
            <p id="eventCardAttendees" class="my-0">${event.attendees}</p>
          </div>
          <div class="d-flex flex-row gap-2">
            <strong>Venue:</strong>
            <p id="eventCardVenue" class="my-0">${event.venue}</p>
          </div>
        `;

      const actions = document.createElement("div");
      actions.id = "eventCardActions";
      actions.className = "d-flex flex-row justify-content-around mt-3";

      const registerButton = document.createElement("div");
      registerButton.id = "registerButton";
      registerButton.className = "d-flex flex-column align-items-center";
      registerButton.innerHTML = `
          <a href="/ccsync-v1/pages/home/event/add-event-person.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-person-plus"></i>
            <p class="my-0" hidden>Register</p>
          </a>
        `;

      const editButton = document.createElement("div");
      editButton.id = "editButton";
      editButton.className = "d-flex flex-column align-items-center justify-content-center";
      editButton.innerHTML = `
          <a href="/ccsync-v1/pages/home/event/edit-event.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-pencil-square"></i>
            <p class="my-0" hidden>Edit</p>
          </a>
        `;

      const viewButton = document.createElement("div");
      viewButton.id = "viewButton";
      viewButton.className = "d-flex flex-column align-items-center";
      viewButton.innerHTML = `
          <a href="/ccsync-v1/pages/home/event/view-event-single.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-eye"></i>
            <p class="my-0" hidden>View</p>
          </a>
        `;

      actions.appendChild(registerButton);
      actions.appendChild(editButton);
      actions.appendChild(viewButton);
      cardBody.appendChild(actions);
      card.appendChild(cardBody);
      container.appendChild(card);
    });
  } else {
    const tbody = document.getElementById("eventContainer");
    tbody.innerHTML = `
      <div class="text-center text-info h4">
        No events available.
      </div>
    `;
  }
}
