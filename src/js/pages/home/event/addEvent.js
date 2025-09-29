import '/js/utils/core.js';
import '/scss/pages/home/event/addEvent.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    setSidebar();

    const form = document.querySelector("form");
    form.addEventListener("submit", handleSubmit);
});

async function initHome() {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/ccsync-v1/pages/auth/login.html";
}

async function handleSubmit(event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const timeFrom = document.getElementById("fromTime").value;
    const timeTo = document.getElementById("toTime").value;
    const venue = document.getElementById("venue").value;
    const registrationStart = document.getElementById("registrationStart").value;
    const registrationEnd = document.getElementById("registrationEnd").value;
    const maxParticipants = document.getElementById("maxParticipants").value;

    try {
        const response = await fetch("http://localhost:8000/api/events", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userData.firebase_token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: eventName,
                venue,
                event_date: eventDate,
                time_from: timeFrom,
                time_to: timeTo,
                registration_start: registrationStart,
                registration_end: registrationEnd,
                max_participants: parseInt(maxParticipants)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Event added successfully:", data.data);
    } catch (error) {
        console.error("Error adding event:", error);
    }
}
