import "/js/utils/core.js";
import "/scss/pages/home/event/viewEvent.scss";
import { setSidebar } from "/components/js/sidebar.js";
import { getCurrentSession } from "/js/utils/sessionManager";

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  await setSidebar();
  loadEvents();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadEvents() {
  try {
    // Always call the API endpoint for real events
    const response = await fetch(
      "/ccsync-api-plain/event/getEvents.php",
      {
        headers: {
          Authorization: `Bearer ${userData.firebase_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if we have successful response with events
    if (data.success && data.events && data.events.length > 0) {
      displayEvents(data.events);
    } else {
      // Fallback: show empty state if no events or empty response
      displayEvents([]);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    // Fallback: show empty state on error
    displayEvents([]);
  }
}

function displayEvents(events) {
  const container = document.getElementById("eventContainer");
  container.className += " gap-4";
  container.innerHTML = "";

  if (events.length > 0) {
    events.forEach((event) => {
      const card = document.createElement("div");
      card.id = "eventCardItem";
      card.className = "card px-0 col-md-4 col-sm-6 mb-4";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      cardBody.innerHTML = `
        <h5 class="card-title">${event.name}</h5>
        
        <div class="event-details">
          <div class="d-flex">
            <i class="bi bi-calendar-event"></i>
            <span class="event-label">Date:</span>
            <p class="event-value">${event.event_date}</p>
          </div>
          <div class="d-flex">
            <i class="bi bi-people"></i>
            <span class="event-label">Attendees:</span>
            <p class="event-value">${event.max_participants}</p>
          </div>
          <div class="d-flex">
            <i class="bi bi-geo-alt"></i>
            <span class="event-label">Venue:</span>
            <p class="event-value">${event.venue}</p>
          </div>
        </div>
      `;

      const actions = document.createElement("div");
      actions.id = "eventCardActions";
      actions.innerHTML = `
        <div class="d-flex">
          <div class="action-item">
            <a href="/pages/home/event/add-event-person.html?event_id=${event.id}" class="text-decoration-none">
              <i class="bi bi-person-plus"></i>
            </a>
          </div>
          <div class="action-item">
            <a href="/pages/home/event/edit-event.html" class="text-decoration-none">
              <i class="bi bi-pencil-square"></i>
            </a>
          </div>
          <div class="action-item">
            <a href="/pages/home/event/view-event-single.html" class="text-decoration-none">
              <i class="bi bi-eye"></i>
            </a>
          </div>
        </div>
      `;

      cardBody.appendChild(actions);
      card.appendChild(cardBody);
      container.appendChild(card);
    });
  } else {
    container.innerHTML = `
      <div class="text-center text-info h4">
        No events available.
      </div>
    `;
  }
}
