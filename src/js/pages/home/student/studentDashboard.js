import "/js/utils/core.js";
import "/scss/pages/home/student/studentDashboard.scss";
import { getCurrentSession } from "/js/utils/sessionManager";
import { fetchEvents } from "/js/utils/api.js";
import { shimmerLoader } from "/js/utils/shimmerLoader";
import { setupLogout } from "/js/utils/navigation.js";

// Show body after styles are loaded
document.body.classList.add("loaded");

let userData = null;

// Cache so navigating back is instant
const DASHBOARD_CACHE_KEY = "studentDashboard:events:v1";
const DASHBOARD_CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

document.addEventListener("DOMContentLoaded", async () => {
  // 1) Try to render immediately from cache (no shimmer)
  tryShowFromCache();

  // 2) Verify session, then refresh in background
  await initDashboard();
  loadEvents();
  // Enable logout in navbar
  setupLogout();
});

async function initDashboard() {
  //commented out for testing purposes
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
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

    // Cache rendered HTML for instant subsequent loads
    cacheCurrentHTML();

    // Ensure visibility in case we didn't render from cache first
    shimmerLoader.hide("#eventsShimmerContainer", 300);
    setTimeout(() => {
      document.getElementById("eventsShimmerContainer").style.display = "none";
      document.getElementById("eventsContainer").style.display = "grid";
    }, 300);
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

/* -------------------------------------------------------------------------- */
/*                             CACHING HELPERS                                */
/* -------------------------------------------------------------------------- */

function tryShowFromCache() {
  try {
    const cached = safeGetCache(DASHBOARD_CACHE_KEY, DASHBOARD_CACHE_TTL_MS);
    if (!cached || typeof cached.html !== "string") return;

    const container = document.getElementById("eventsContainer");
    container.innerHTML = cached.html;

    // Show instantly, hide shimmer
    const shimmer = document.getElementById("eventsShimmerContainer");
    if (shimmer) shimmer.style.display = "none";
    container.style.display = "grid";
  } catch {}
}

function cacheCurrentHTML() {
  try {
    const container = document.getElementById("eventsContainer");
    const html = container?.innerHTML ?? "";
    if (!html) return;
    sessionStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify({ html, ts: Date.now() })
    );
  } catch {}
}

function safeGetCache(key, ttlMs) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== "number") return null;
    const fresh = Date.now() - parsed.ts < ttlMs;
    return fresh ? parsed : null;
  } catch {
    return null;
  }
}
