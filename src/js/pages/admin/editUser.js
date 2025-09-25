import "/js/utils/core.js";
import { getCurrentSession } from "/js/utils/sessionManager";

let userData = null;
let userIdToEdit = null;

document.addEventListener("DOMContentLoaded", async () => {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/ccsync-v1/pages/auth/login.html";

    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    userIdToEdit = urlParams.get('id');

    if (!userIdToEdit) {
        alert("No user ID provided");
        window.location.href = "/ccsync-v1/pages/admin/index.html";
        return;
    }

    // Fetch user details to populate the form
    await loadUserDetails(userIdToEdit);

    const form = document.getElementById("edit-user-form");
    form.addEventListener("submit", handleSubmit);
});

async function loadUserDetails(userIdToEdit) {
    try {
        // Fetch user details from API using the database ID
        const response = await fetch(`http://localhost:8000/api/users/id/${userIdToEdit}`, {
            headers: {
                'Authorization': `Bearer ${userData.firebase_token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const user = data.user;

        // Store the id_school_number for update/delete operations
        window.id_school_number = user.id_school_number;

        // Populate form with user details
        document.getElementById("firstName").value = user.name.split(' ')[0] || '';
        document.getElementById("lastName").value = user.name.split(' ').slice(1).join(' ') || '';
        document.getElementById("email").value = user.email || '';
        document.getElementById("idSchoolNumber").value = user.id_school_number || '';
        document.getElementById("role").value = user.role || 'user';

    } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to load user details");
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const idSchoolNumber = document.getElementById("idSchoolNumber").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("http://localhost:8000/api/users/edit-user/id/" + userIdToEdit, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${userData.firebase_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id_token: userData.firebase_token,
                id: userData.id,
                email: email,
                display_name: `${firstName} ${lastName}`,
                id_school_number: idSchoolNumber,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        alert("User details updated successfully!");
        window.location.href = "/ccsync-v1/pages/admin/index.html";
    } catch (error) {
        console.error("Error updating user details:", error);
        alert(`Failed to update user details: ${error.message}`);
    }
}
