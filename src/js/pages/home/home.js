import "/js/utils/core.js";
import "/scss/pages/home/home.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager.js";

let userData = null;
let allMembers = []; // Store all members

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  setSidebar();
  await loadHero();
  printEventList();
});

async function initHome() {
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadHero() {
  const totalCssStudents = document.getElementById("totalCSSStudents");
  totalCssStudents.textContent = "1256";

  const registeredMembers = document.getElementById("registeredMembers");
  const paidMembership = document.getElementById("paidMembership");

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

    registeredMembers.textContent = allMembers.length;
    const paidMembersCount = allMembers.filter(
      (member) => member.is_paid
    ).length;
    paidMembership.textContent = paidMembersCount;
  } catch (error) {
    console.error("Error fetching hero stats:", error);
  }
}

async function printEventList() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  let events = [];

  try {
    const response = await fetch(
      "http://localhost:8000/api/events?upcoming=true",
      {
        headers: {
          Authorization: `Bearer ${userData.firebase_token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    events = data.data || [];
  } catch (error) {
    console.error("Error fetching event list:", error);
  }

  if (events.length === 0) {
    eventList.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
            <h4 class="text-muted">No events currently scheduled</h4>
            <p class="text-muted mb-4">Check back later for upcoming events</p>
                  <a
                    href="/pages/home/event/add-event.html"
                    class="btn btn-primary-custom text-decoration-none"
                  >
                    <i class="bi bi-plus-circle-fill me-2"></i>
                    Add New Event
                  </a>
        </div>
    `;
    return;
  }

  // Display events in a responsive grid
  events.forEach((event) => {
    const eventItem = document.createElement("div");
    eventItem.className = "col-12 col-md-6 col-lg-4";
    eventItem.innerHTML = `
            <div class="card h-100 border-0 shadow-sm" style="border-radius: 15px;">
                <img 
                    src="https://placehold.co/400x200/6c5ce7/ffffff?text=${encodeURIComponent(
                      event.name
                    )}&font=roboto" 
                    class="card-img-top" 
                    alt="${event.name}"
                    style="height: 200px; object-fit: cover; border-radius: 15px 15px 0 0;"
                />
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2">${event.name}</h5>
                    <p class="card-text text-muted small mb-2">
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
                    <p class="card-text">${
                      event.description || "No description available"
                    }</p>
                </div>
                <div class="card-footer bg-transparent border-0 p-4 pt-0">
                    <a href="/pages/home/event/view-event.html?id=${
                      event.id
                    }" class="btn btn-outline-primary btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        `;
    eventList.appendChild(eventItem);
  });
}
