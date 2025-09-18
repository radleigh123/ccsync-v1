import '/js/utils/core.js';
import { setSidebar } from '/components/js/sidebar';
import '/scss/pages/admin/member/viewMember.scss';
import 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    setSidebar();
    loadUsers();
});

export function initHome() {
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
}

async function loadUsers() {
    try {
        // TODO: Uncomment me
        // const response = await fetch("fetch_users.php"); // PHP endpoint
        // const users = await response.json();

        // Users mock data
        const users = [
            { name: "Alice Johnson", year_level: "3", program: "Computer Science" },
            { name: "Bob Smith", year_level: "2", program: "Information Technology" },
            { name: "Charlie Brown", year_level: "1", program: "Software Engineering" }
        ];

        const tbody = document.getElementById("userTableBody");
        tbody.innerHTML = "";

        if (users.length > 0) {
            users.forEach(user => {
                const row = `
              <tr>
                <td class="ps-3">${user.name}</td>
                <td class="ps-3 text-center">${user.year_level}</td>
                <td class="ps-3 text-center">${user.program}</td>
              </tr>
            `;
                tbody.innerHTML += row;
            });
            tbody.innerHTML += `
            <tr>
              <td colspan="3" class="text-muted text-center">
                ---------------- Nothing follows ----------------
              </td>
            </tr>
          `;
        } else {
            tbody.innerHTML = `
            <tr>
              <td colspan="3" class="text-muted">
                ---------------- Nothing follows ----------------
              </td>
            </tr>
          `;
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}