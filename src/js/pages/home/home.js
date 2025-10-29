import "/js/utils/core.js";
import "/scss/pages/home/home.scss";
import { getCurrentSession } from "/js/utils/sessionManager.js";
import { renderStatsCard } from "/components/js/stats-card.js";
import { fetchMembers, fetchUsers, fetchThisMonthEvents } from "/js/utils/api.js";
import { shimmerLoader } from "/js/utils/shimmerLoader.js";

let userData = null;
let allMembers = []; // Store all members

/**
 * Initializes the home page by checking user session and loading data.
 * @async
 * @function initHome
 * @returns {Promise<void>}
 */
async function initHome() {
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

/**
 * Loads and renders the hero section with stats cards and event list.
 * @async
 * @function loadHero
 * @returns {Promise<void>}
 */
async function loadHero() {
  const statsCardsContainer = document.getElementById("statsCards");

  try {
    // Fetch all required data
    const membersData = await fetchMembers();
    const usersData = await fetchUsers();
    
    allMembers = membersData.members || [];

    // Calculate stats from actual database data
    const registeredMembersValue = allMembers.length;
    const totalCssStudentsValue = usersData.totalCount || 0;
    const paidMembersCount = allMembers.filter(
      (member) => member.is_paid === 1 || member.is_paid === true
    ).length;

    console.log('✓ Dashboard stats loaded:');
    console.log('  - Registered Members:', registeredMembersValue);
    console.log('  - Total CCS Students:', totalCssStudentsValue);
    console.log('  - Paid Members:', paidMembersCount);

    // Render stats cards
    const cards = [
      {
        icon: "people-fill",
        color: "primary",
        title: "Registered Members",
        value: registeredMembersValue,
        description: "Active members in the organization",
        id: "registeredMembers",
      },
      {
        icon: "mortarboard-fill",
        color: "success",
        title: "Total CCS Students",
        value: totalCssStudentsValue,
        description: "Computer Science students enrolled",
        id: "totalCSSStudents",
      },
      {
        icon: "credit-card-fill",
        color: "warning",
        title: "Paid Membership",
        value: paidMembersCount,
        description: "Members with active payments",
        id: "paidMembership",
      },
    ];

    for (const card of cards) {
      const cardHtml = await renderStatsCard(
        card.icon,
        card.color,
        card.title,
        card.value,
        card.description,
        card.id
      );
      statsCardsContainer.insertAdjacentHTML("beforeend", cardHtml);
    }

    // Hide shimmer and show stats
    shimmerLoader.hide("#statsShimmerContainer", 600);
    setTimeout(() => {
      document.getElementById("statsShimmerContainer").style.display = "none";
      document.getElementById("statsCards").style.display = "";
    }, 600);
  } catch (error) {
    console.error("Error loading hero data:", error);
    // Fallback: render with default values
    const fallbackCards = [
      {
        icon: "people-fill",
        color: "primary",
        title: "Registered Members",
        value: "0",
        description: "Active members in the organization",
        id: "registeredMembers",
      },
      {
        icon: "mortarboard-fill",
        color: "success",
        title: "Total CCS Students",
        value: "0",
        description: "Computer Science students enrolled",
        id: "totalCSSStudents",
      },
      {
        icon: "credit-card-fill",
        color: "warning",
        title: "Paid Membership",
        value: "0",
        description: "Members with active payments",
        id: "paidMembership",
      },
    ];

    for (const card of fallbackCards) {
      const cardHtml = await renderStatsCard(
        card.icon,
        card.color,
        card.title,
        card.value,
        card.description,
        card.id
      );
      statsCardsContainer.insertAdjacentHTML("beforeend", cardHtml);
    }

    // Still hide shimmer and show stats even on error
    shimmerLoader.hide("#statsShimmerContainer", 300);
    setTimeout(() => {
      document.getElementById("statsShimmerContainer").style.display = "none";
      document.getElementById("statsCards").style.display = "";
    }, 300);
  }
}

/**
 * Fetches and renders the list of events for the current month on the home page.
 * @async
 * @function printEventList
 * @returns {Promise<void>}
 */
async function printEventList() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  let events = [];

  try {
    console.log("Fetching this month's events from API...");
    const data = await fetchThisMonthEvents();

    events = data.events || [];
    console.log("✓ Fetched this month's events:", events.length, "events");
  } catch (error) {
    console.error("Error fetching event list:", error);
    console.log("Falling back to no events display");
  }

  if (events.length === 0) {
    eventList.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="glassmorphic-card">
                <div class="card-body p-5 text-center">
                    <i class="bi bi-calendar-x display-1 text-white-50 mb-3"></i>
                    <h4 class="text-white mb-3">📅 No events currently scheduled for this month</h4>
                    <p class="text-white-75 mb-4">Check back later for upcoming events and activities</p>
                    <a href="/pages/home/event/add-event.html" class="btn btn-light text-dark">
                        ➕ Add New Event
                    </a>
                </div>
            </div>
        </div>
    `;
    // Hide shimmer and show event list
    shimmerLoader.hide("#eventShimmerList", 600);
    setTimeout(() => {
      document.getElementById("eventShimmerList").style.display = "none";
      document.getElementById("eventList").style.display = "";
    }, 600);
    return;
  }

  // Display events in a responsive grid
  events.forEach((event) => {
    const eventItem = document.createElement("div");
    eventItem.className = "col-12 col-md-6 col-lg-4";
    eventItem.innerHTML = `
            <div class="glassmorphic-card h-100">
                <img 
                    src="https://placehold.co/400x200/6c5ce7/ffffff?text=${encodeURIComponent(
                      event.name
                    )}&font=roboto" 
                    class="card-img-top" 
                    alt="${event.name}"
                    style="height: 200px; object-fit: cover; border-radius: 20px 20px 0 0;"
                />
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2 text-white">${event.name}</h5>
                    <p class="card-text text-white-50 small mb-2">
                        <i class="bi bi-calendar-event me-1"></i>
                        ${new Date(event.event_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>
                    <p class="card-text text-white-75">${
                      event.description || "No description available"
                    }</p>
                </div>
                <div class="card-footer bg-transparent border-0 p-4 pt-0">
                    <a href="/pages/home/event/view-event.html?id=${
                      event.id
                    }" class="btn btn-outline-light btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        `;
    eventList.appendChild(eventItem);
  });

  // Hide shimmer and show event list
  shimmerLoader.hide("#eventShimmerList", 600);
  setTimeout(() => {
    document.getElementById("eventShimmerList").style.display = "none";
    document.getElementById("eventList").style.display = "";
  }, 600);
}

// Initialize the home page
initHome()
  .then(() => {
    loadHero();
    printEventList();
  })
  .catch((error) => console.error("Initialization error:", error));
