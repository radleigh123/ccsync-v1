import "/js/utils/core.js";
import { getCurrentSession } from "/js/utils/sessionManager";

let userData;

document.addEventListener('DOMContentLoaded', async () => {
    userData = await getCurrentSession();
    if (!userData || !userData.firebase_token) window.location.href = "/pages/auth/login.html";

    await listUsers();
});

async function listUsers() {
    userData = await getCurrentSession();
    if (!userData || !userData.firebase_token) {
        console.error("No authentication token available");
        return;
    }

    const tbody = document.getElementById('tbody-user');
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear existing rows

    // Mock user data
    /* const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', emailVerifiedAt: '2023-01-01 19:29:31', schoolId: '20200937', role: 'Admin' },
    ]; */
    const users = [];

    // Populate the table with user data
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.emailVerifiedAt}</td>
            <td>${user.schoolId}</td>
            <td>${user.role}</td>
            <td>
                <button>Edit</button>
                <button>Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    try {
        const response = await fetch("https://ccsync-api-master-ll6mte.laravel.cloud/api/users", {
            headers: {
                'Authorization': `Bearer ${userData.firebase_token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        populateUserTable(data.users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function populateUserTable(users) {
    const tbody = document.getElementById('tbody-user');
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');

        const role = user.roles[user.roles.length - 1] != undefined ? user.roles[user.roles.length - 1] : 'Unregistered'

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.display_name}</td>
            <td>${user.email}</td>
            <td>${user.email_verified ? '✔' : 'X'}</td>
            <td>${user.id_school_number}</td>
            <td>${role}</td>
            <td>
                <button id="btn-edit">Edit</button>
                <button id="btn-delete">Delete</button>
            </td>
        `;
        const btnEdit = row.querySelector("#btn-edit");
        const btnDelete = row.querySelector("#btn-delete");

        btnEdit.addEventListener("click", () => {
            window.location.href = `/pages/admin/edit-user.html?id=${user.id}`;
        });

        btnDelete.addEventListener("click", async () => {
            if (userData.id == user.id) {
                alert("Cannot delete the currently signed-in user. That is you.");
                return;
            }

            if (confirm(`Are you sure you want to delete user ${user.display_name}?`)) {
                try {
                    const response = await fetch(`https://ccsync-api-master-ll6mte.laravel.cloud/api/users/${user.id}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${userData.firebase_token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    await listUsers();
                    alert(`User ${user.display_name} deleted successfully.`);
                } catch (error) {
                    console.error("Error deleting user:", error);
                    alert(`Failed to delete user ${user.display_name}.`);
                }
            }
        });

        tbody.appendChild(row);
    });
}