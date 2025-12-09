import "/js/utils/core.js";
import "/scss/pages/home/student/studentDashboard.scss";
import { getCurrentSession } from "/js/utils/sessionManager";
import { fetchEvents } from "/js/utils/api.js";
import { shimmerLoader } from "/js/utils/shimmerLoader";

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initDashboard();
  loadEvents();
});

async function initDashboard() {
  //commented out for testing purposes
  // userData = await getCurrentSession();
  // if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadEvents() {
  try {
    console.log("📋 Loading all events...");

    const events = await fetchEvents();

    if (events.data && events.data.length > 0) {
      console.log("✓ Events loaded:", events.data.length);
      displayEvents(events.data);
    } else {
      console.log("ℹ️ No events found");
      displayEmptyState();
    }

    shimmerLoader.hide("#eventsShimmerContainer", 600);

    setTimeout(() => {
      document.getElementById("eventsShimmerContainer").style.display = "none";
      document.getElementById("eventsContainer").style.display = "grid";
    }, 600);
  } catch (error) {
    console.error("❌ Error loading events:", error);
    displayEmptyState();

    shimmerLoader.hide("#eventsShimmerContainer", 300);
    setTimeout(() => {
      document.getElementById("eventsShimmerContainer").style.display = "none";
      document.getElementById("eventsContainer").style.display = "grid";
    }, 300);
  }
}

function displayEvents(events) {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "";

  events.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.className = "event-card";

    const eventImage = document.createElement("div");
    eventImage.className = "event-image";
    eventImage.textContent = "📅";

    const eventContent = document.createElement("div");
    eventContent.className = "event-content";

    const eventTitle = document.createElement("h3");
    eventTitle.className = "event-title";
    eventTitle.textContent = event.name;

    const eventDate = document.createElement("div");
    eventDate.className = "event-date";
    eventDate.innerHTML = `<span>📅</span> ${event.event_date}`;

    const eventLocation = document.createElement("div");
    eventLocation.className = "event-location";
    eventLocation.innerHTML = `<span>📍</span> ${event.venue}`;

    const eventDescription = document.createElement("p");
    eventDescription.className = "event-description";
    eventDescription.textContent =
      event.description || "No description available";

    const eventFooter = document.createElement("div");
    eventFooter.className = "event-footer";

    const eventAttendees = document.createElement("span");
    eventAttendees.className = "event-attendees";
    eventAttendees.textContent = `${event.max_participants || "TBD"} attendees`;

    const eventStatus = document.createElement("span");
    eventStatus.className = "event-status";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate_ = new Date(event.event_date);
    eventDate_.setHours(0, 0, 0, 0);

    if (eventDate_ > today) {
      eventStatus.classList.add("status-upcoming");
      eventStatus.textContent = "Upcoming";
    } else if (eventDate_ < today) {
      eventStatus.classList.add("status-completed");
      eventStatus.textContent = "Completed";
    } else {
      eventStatus.classList.add("status-ongoing");
      eventStatus.textContent = "Ongoing";
    }

    eventFooter.append(eventAttendees, eventStatus);
    eventContent.append(
      eventTitle,
      eventDate,
      eventLocation,
      eventDescription,
      eventFooter
    );

    eventCard.append(eventImage, eventContent);
    container.appendChild(eventCard);
  });
}

function displayEmptyState() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = `
    <div class="text-center text-muted py-5 col-12">
      <p class="h5">No events found</p>
    </div>
  `;
}
