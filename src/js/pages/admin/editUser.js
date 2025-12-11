import "/js/utils/core.js";
import { getCurrentSession } from "/js/utils/sessionManager";

let userData = null;
let userIdToEdit = null;

document.addEventListener("DOMContentLoaded", async () => {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";

    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    userIdToEdit = urlParams.get('id');

    if (!userIdToEdit) {
        alert("No user ID provided");
        window.location.href = "/pages/admin/index.html";
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
        const response = await fetch(`https://ccsync-api-master-ll6mte.laravel.cloud/api/users/${userIdToEdit}`, {
            headers: {
                'Authorization': `Bearer ${userData.firebase_token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Store the id_school_number for update/delete operations
        window.id_school_number = data.id_school_number;

        // Populate form with user details
        document.getElementById("firstName").value = data.display_name.split(' ')[0] || '';
        document.getElementById("lastName").value = data.display_name.split(' ').slice(1).join(' ') || '';
        document.getElementById("email").value = data.email || '';
        document.getElementById("idSchoolNumber").value = data.id_school_number || '';
        console.log(data.roles[data.roles.length - 1]);
        // document.getElementById("role").value = data.roles[data.roles.length - 1] || 'user';

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
        const response = await fetch("https://ccsync-api-master-ll6mte.laravel.cloud/api/auth/user/edit-user/" + userIdToEdit, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${userData.firebase_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id_token: userData.firebase_token,
                id: parseInt(userIdToEdit),
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
        window.location.href = "/pages/admin/index.html";
    } catch (error) {
        console.error("Error updating user details:", error);
        alert(`Failed to update user details: ${error.message}`);
    }
}
