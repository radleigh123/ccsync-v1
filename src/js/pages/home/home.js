import '/js/utils/core.js';
import '/scss/pages/home/home.scss';
import { setSidebar } from '/components/js/sidebar.js';
import { setupLogout } from "/js/utils/navigation.js";
import { setupFloatingNav } from "/components/js/floating_button.js";
import { setupMobileSidebarToggle } from "/components/js/mobile_sidebar_toggle.js";
import { Tooltip } from 'bootstrap';

export function initHome() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }
    const userData = JSON.parse(user);

    const welcomeEl = document.querySelector("h1");
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome back, ${userData.name_first || "User"}!`;
    }

    // Optionally, populate other dashboard data here
    // Example: last sync time, stats, etc.
    // You can add more selectors and assignments as needed
}

export async function printList() {
    const usersList = document.querySelector("#userList");
    const errorMsg = document.querySelector("#errorMsg");
    if (usersList) usersList.innerHTML = '';
    if (errorMsg) errorMsg.textContent = '';
    try {
        const response = await fetch("http://localhost:8080/demo/ccsync/auth/usersList.php");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data;
        try {
            data = await response.json();
        } catch (jsonErr) {
            throw new Error("Invalid JSON returned from server.");
        }
        if (Array.isArray(data) && data.length > 0) {
            // Add button above user cards
            const addBtn = document.createElement('button');
            addBtn.className = 'btn btn-success mb-2';
            addBtn.textContent = 'Add User';
            addBtn.onclick = function () {
                // Simple prompt-based add form (in production, use a modal)
                const firstName = prompt('First name:');
                const lastName = prompt('Last name:');
                const email = prompt('Email:');
                const schoolId = prompt('School ID Number:');

                if (firstName && lastName && email && schoolId) {
                    fetch('http://localhost:8080/demo/ccsync/auth/add.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name_first: firstName,
                            name_last: lastName,
                            email: email,
                            school_id: schoolId,
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message || data.error);
                            if (data.message) {
                                // Refresh the list
                                printList();
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Failed to add user');
                        });
                }
            };
            usersList.appendChild(addBtn);

            // Create grid container for user cards
            const gridContainer = document.createElement('div');
            gridContainer.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';

            // Get all user keys for consistent display
            const keys = Object.keys(data[0]);

            // Create user cards
            data.forEach(user => {
                // Create column for each user
                const colDiv = document.createElement('div');
                colDiv.className = 'col';

                // Create card with cursor pointer to indicate clickable
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card h-100';
                cardDiv.style.cursor = 'pointer';

                // Make the entire card clickable
                cardDiv.addEventListener('click', function (e) {
                    // Don't trigger if clicking buttons in the footer
                    if (e.target.tagName === 'BUTTON' || e.target.closest('.card-footer')) {
                        return;
                    }

                    // Store the selected user in localStorage
                    localStorage.setItem('selected_user', JSON.stringify(user));

                    // Navigate to profile page
                    window.location.href = '/ccsync-v1/pages/profile/profile.html';
                });

                // Card body
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Add user information
                keys.forEach(key => {
                    const userInfoDiv = document.createElement('p');
                    const label = document.createElement('strong');
                    label.textContent = `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: `;
                    userInfoDiv.appendChild(label);
                    userInfoDiv.appendChild(document.createTextNode(user[key] || 'N/A'));
                    cardBody.appendChild(userInfoDiv);
                });

                // Card footer for actions
                const cardFooter = document.createElement('div');
                cardFooter.className = 'card-footer d-flex justify-content-between';

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-primary btn-sm';
                editBtn.textContent = 'Edit';
                editBtn.onclick = function () {
                    const userData = { ...user };
                    // Simple prompt-based edit form (in production, use a modal)
                    const idNumber = prompt('ID Number:', userData.id_number);
                    const firstName = prompt('First name:', userData.name_first);
                    const lastName = prompt('Last name:', userData.name_last);
                    const email = prompt('Email:', userData.email);
                    const schoolId = prompt('School ID:', userData.id_school_number);

                    if (firstName && lastName && email) {
                        fetch('http://localhost:8080/demo/ccsync/auth/edit.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: idNumber,
                                name_first: firstName,
                                name_last: lastName,
                                email: email,
                                school_id: schoolId,
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message || data.error);
                                if (data.message) {
                                    // Refresh the list
                                    printList();
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Failed to update user');
                            });
                    }
                };

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger btn-sm';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = function () {
                    if (confirm(`Are you sure you want to delete ${user.name_first} ${user.name_last}?`)) {
                        fetch('http://localhost:8080/demo/ccsync/auth/delete.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                user_id: user.id
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message || data.error);
                                if (data.message) {
                                    // Refresh the list
                                    printList();
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Failed to delete user');
                            });
                    }
                };

                // Add buttons to footer
                cardFooter.appendChild(editBtn);
                cardFooter.appendChild(deleteBtn);

                // Assemble card
                cardDiv.appendChild(cardBody);
                cardDiv.appendChild(cardFooter);
                colDiv.appendChild(cardDiv);

                // Add to grid
                gridContainer.appendChild(colDiv);
            });

            usersList.appendChild(gridContainer);
        } else {
            usersList.textContent = 'No users found.';
        }
    } catch (error) {
        if (errorMsg) {
            errorMsg.textContent = 'Error loading user list: ' + error.message;
        }
        if (usersList) {
            usersList.textContent = '';
        }
        console.error('USER LIST ERROR:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initHome();
    // setupLogout();
    // setSidebar();
    // setupFloatingNav();
    // printList();
    // setupMobileSidebarToggle();

    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new Tooltip(tooltipTriggerEl)
    })
});
