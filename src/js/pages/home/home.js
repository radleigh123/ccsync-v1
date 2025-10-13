import "/js/utils/core.js";
import "/scss/pages/home/home.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager.js";
import { renderStatsCard } from "/components/js/stats-card.js";

let userData = null;
let allMembers = []; // Store all members

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  await setSidebar();
  await loadHero();
  printEventList();
});

async function initHome() {
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadHero() {
  const statsCardsContainer = document.getElementById("statsCards");

  // Hardcoded value for Total CSS Students
  const totalCssStudentsValue = "1256";

  try {
    const response = await fetch("http://localhost:8000/api/member", {
      headers: {
        Authorization: `Bearer ${userData.firebase_token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    allMembers = data.members;

    const registeredMembersValue = allMembers.length;
    const paidMembersCount = allMembers.filter(
      (member) => member.is_paid
    ).length;

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
        title: "Total CSS Students",
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
        title: "Total CSS Students",
        value: totalCssStudentsValue,
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
  }
}

async function printEventList() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  let events = [];

  try {
    console.log("Fetching events from API...");
    const response = await fetch(
      "http://localhost:8000/api/events?upcoming=true",
      {
        headers: {
          Authorization: `Bearer ${userData.firebase_token}`,
          Accept: "application/json",
        },
      }
    );

    console.log("API Response status:", response.status);
    console.log("API Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    events = data.data || [];
    console.log("Fetched events data:", data);
    console.log("Events array:", events);
    console.log("Number of events:", events.length);
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
                    <h4 class="text-white mb-3">📅 No events currently scheduled</h4>
                    <p class="text-white-75 mb-4">Check back later for upcoming events and activities</p>
                    <a href="/pages/home/event/add-event.html" class="btn btn-light text-dark">
                        ➕ Add New Event
                    </a>
                </div>
            </div>
        </div>
    `;
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
}
