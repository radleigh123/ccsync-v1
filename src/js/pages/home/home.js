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
    if (!userData) window.location.href = "/ccsync-v1/pages/auth/login.html";
}

async function loadHero() {
    const totalCssStudents = document.getElementById("totalCSSStudents");
    totalCssStudents.textContent = "1256";

    const registeredMembers = document.getElementById("registeredMembers");
    const paidMembership = document.getElementById("paidMembership");

    try {
        const response = await fetch("http://localhost:8000/api/member", {
            headers: {
                "Authorization": `Bearer ${userData.firebase_token}`,
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allMembers = data.members;

        registeredMembers.textContent = allMembers.length;
        const paidMembersCount = allMembers.filter(member => member.is_paid).length;
        paidMembership.textContent = paidMembersCount;

    } catch (error) {
        console.error("Error fetching hero stats:", error);
    }
}

async function printEventList() {
    // Mock events for demonstration
    /* const events = [
        { title: "CCS Acquaintance Party", date: "2024-07-01 10:00 AM", description: "A casual gathering to get to know each other." },
        { title: "Intramurals", date: "2024-07-05 11:59 PM", description: "A friendly sports competition between teams." },
    ]; */

    const events = []; // Empty array to demonstrate "no events" case

    try {
        const response = await fetch("http://localhost:8000/api/event?upcoming=true", {
            headers: {
                "Authorization": `Bearer ${userData.firebase_token}`,
                "Accept": "application/json",
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        events.push(...data.events);

    } catch (error) {
        console.error("Error fetching event list:", error);
    }

    const eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    if (events.length === 0) {
        eventList.innerHTML = `
            <p class="display-6 text-center" style="font-family: 'Courier New', Courier, monospace;">No events currently scheduled.</p>
        `;
        return;
    }

    // TODO: image data implementation addition
    events.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.id = "eventItem";
        eventItem.className = "card px-0";
        eventItem.style.width = "18rem";
        eventItem.style.borderRadius = "20px";
        eventItem.innerHTML = `
            <img src="https://placehold.co/200x150/orange/white?text=image&font=roboto" class="card-img-top" alt="Event image placeholder" />
            <div class="card-body">
                <p class="card-title h5 text-center">${event.title}</p>
            </div>`;
        eventList.appendChild(eventItem);
    });
}
