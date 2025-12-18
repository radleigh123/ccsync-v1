import "/js/utils/core.js";
import "/scss/pages/home/event/viewEvent.scss";
// import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";
import { fetchEvents } from "/js/utils/api.js";
import { shimmerLoader } from "/js/utils/shimmerLoader";
import { setupLogout } from '/js/utils/navigation.js';

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  // await setSidebar();
  setupLogout();
  loadEvents();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}


async function loadEvents() {
  try {
    console.log("📋 Loading all events...");

    // Use the API utility function
    const events = await fetchEvents();

    // console.log(events);

    if (events.data && events.data.length > 0) {
      console.log("✓ Events loaded:", events.data.length);
      categorizeAndDisplayEvents(events.data);
    } else {
      console.log("ℹ️  No events found");
      displayEmptyState();
    }

    // Hide shimmer loaders and show carousels
    shimmerLoader.hide("#incomingShimmerContainer", 600);
    shimmerLoader.hide("#completedShimmerContainer", 600);
    setTimeout(() => {
      document.getElementById("incomingShimmerContainer").style.display = "none";
      document.getElementById("incomingEventsCarousel").style.display = "block";
      document.getElementById("completedShimmerContainer").style.display = "none";
      document.getElementById("completedEventsCarousel").style.display = "block";
    }, 600);
  } catch (error) {
    console.error("❌ Error loading events:", error);
    displayEmptyState();
    // Still hide shimmer on error
    shimmerLoader.hide("#incomingShimmerContainer", 300);
    shimmerLoader.hide("#completedShimmerContainer", 300);
    setTimeout(() => {
      document.getElementById("incomingShimmerContainer").style.display = "none";
      document.getElementById("incomingEventsCarousel").style.display = "block";
      document.getElementById("completedShimmerContainer").style.display = "none";
      document.getElementById("completedEventsCarousel").style.display = "block";
    }, 300);
  }
}

/**
 * Categorize events into incoming and completed, then display them
 * @param {Array} events - Array of event objects
 */
function categorizeAndDisplayEvents(events) {
  // Get current date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse event date string to local date
  const parseEventDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(year, parseInt(month) - 1, day, 0, 0, 0, 0);
  };

  // Separate events into incoming and completed
  const incomingEvents = [];
  const completedEvents = [];

  events.forEach((event) => {
    const eventDate = parseEventDate(event.event_date);
    if (eventDate >= today) {
      incomingEvents.push(event);
    } else {
      completedEvents.push(event);
    }
  });

  // Sort incoming events by nearest date first (ascending)
  incomingEvents.sort((a, b) => {
    const dateA = parseEventDate(a.event_date);
    const dateB = parseEventDate(b.event_date);
    return dateA - dateB;
  });

  // Sort completed events by most recent first (descending)
  completedEvents.sort((a, b) => {
    const dateA = parseEventDate(a.event_date);
    const dateB = parseEventDate(b.event_date);
    return dateB - dateA;
  });

  // Display both sections
  displayEventSection(incomingEvents, 'incomingEventsContainer', 'Incoming');
  displayEventSection(completedEvents, 'completedEventsContainer', 'Completed');
}

/**
 * Display events in a specific section using carousel with 3 items per slide
 * @param {Array} events - Array of events to display
 * @param {string} containerId - ID of the carousel container element
 * @param {string} sectionType - 'Incoming' or 'Completed'
 */
function displayEventSection(events, containerId, sectionType) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (events.length === 0) {
    // Create a single carousel item with empty state
    const emptyItem = document.createElement('div');
    emptyItem.className = 'carousel-item active';
    emptyItem.innerHTML = `
      <div class="text-center text-muted py-5">
        <p class="h5">No ${sectionType.toLowerCase()} events</p>
      </div>
    `;
    container.appendChild(emptyItem);
    return;
  }

  // Group events into chunks of 3 per carousel item
  const eventsPerSlide = 3;
  const eventGroups = [];

  for (let i = 0; i < events.length; i += eventsPerSlide) {
    eventGroups.push(events.slice(i, i + eventsPerSlide));
  }

  // Create carousel items for each group
  eventGroups.forEach((group, groupIndex) => {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${groupIndex === 0 ? 'active' : ''}`;

    // Create a row for the items centered
    const row = document.createElement('div');
    row.className = 'row px-2 justify-content-center';
    row.style.marginLeft = '0';
    row.style.marginRight = '0';

    group.forEach((event, index) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 col-sm-12';
      col.style.paddingLeft = "12px";
      col.style.paddingRight = "12px";


      const card = document.createElement('div');
      card.id = 'eventCardItem';
      card.className = `card px-0 h-100 carousel-item-card`;

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body d-flex flex-column';
      cardBody.innerHTML = `
        <h5 class="card-title">${event.name}</h5>

        <div class="event-details flex-grow-1">
          <div class="d-flex">
            <i class="bi bi-calendar-event"></i>
            <span class="event-label">Date:</span>
            <p class="event-value">${event.event_date}</p>
          </div>
          <div class="d-flex">
            <i class="bi bi-people"></i>
            <span class="event-label">Attendees:</span>
            <p class="event-value">${event.max_participants || 'Unlimited'}</p>
          </div>
          <div class="d-flex">
            <i class="bi bi-geo-alt"></i>
            <span class="event-label">Venue:</span>
            <p class="event-value">${event.venue}</p>
          </div>
        </div>
      `;

      const actions = document.createElement('div');
      actions.id = 'eventCardActions';
      actions.className = 'mt-auto';
      actions.innerHTML = `
        <div class="d-flex justify-content-around">
          <a href="/pages/home/event/add-event-person.html?event_id=${event.id}" class="text-decoration-none" title="Add participant">
            <i class="bi bi-person-plus"></i>
          </a>
          <a href="/pages/home/event/edit-event.html?event_id=${event.id}" class="text-decoration-none" title="Edit event">
            <i class="bi bi-pencil-square"></i>
          </a>
          <a href="/pages/home/event/view-event-single.html?event_id=${event.id}" class="text-decoration-none" title="View details">
            <i class="bi bi-eye"></i>
          </a>
        </div>
      `;

      cardBody.appendChild(actions);
      card.appendChild(cardBody);
      col.appendChild(card);
      row.appendChild(col);
    });

    carouselItem.appendChild(row);
    container.appendChild(carouselItem);
  });
}

/**
 * Display empty state when no events exist
 */
function displayEmptyState() {
  const incomingContainer = document.getElementById('incomingEventsContainer');
  const completedContainer = document.getElementById('completedEventsContainer');

  // Create empty carousel item for incoming
  const incomingEmptyItem = document.createElement('div');
  incomingEmptyItem.className = 'carousel-item active';
  incomingEmptyItem.innerHTML = `
    <div class="text-center text-muted py-5">
      <p class="h5">No incoming events</p>
    </div>
  `;
  incomingContainer.appendChild(incomingEmptyItem);

  // Create empty carousel item for completed
  const completedEmptyItem = document.createElement('div');
  completedEmptyItem.className = 'carousel-item active';
  completedEmptyItem.innerHTML = `
    <div class="text-center text-muted py-5">
      <p class="h5">No completed events</p>
    </div>
  `;
  completedContainer.appendChild(completedEmptyItem);
}
