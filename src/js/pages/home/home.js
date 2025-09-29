import "/js/utils/core.js";
import "/scss/pages/home/home.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager.js";

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setSidebar();
    printEventList();
});

async function initHome() {
    const user = await getCurrentSession();
    if (!user) window.location.href = "/ccsync-v1/pages/auth/login.html";
}

function printEventList() {
    // Mock events for demonstration
    const events = [
        { title: "CCS Acquaintance Party", date: "2024-07-01 10:00 AM", description: "A casual gathering to get to know each other." },
        { title: "Intramurals", date: "2024-07-05 11:59 PM", description: "A friendly sports competition between teams." },
    ];

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
