import '/js/utils/core.js';
import '/scss/pages/profile/profile.scss';
import { setSidebar } from "/components/js/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";
import { fetchUser } from "/js/utils/api.js";

/**
 * Initializes the profile page by checking user authentication and setting up the profile view.
 * @async
 * @function initProfile
 * @returns {Promise<void>}
 */
export async function initProfile() {
    // Check for logged in user
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    // Continue with existing profile logic
    setupProfile();
}

function setupProfile() {
    // Check if we're viewing a selected user from the card
    const selectedUser = localStorage.getItem("selected_user");

    // Determine which user data to display
    let userData;
    let isCurrentUser = true;

    if (selectedUser) {
        userData = JSON.parse(selectedUser);
        const loggedInUser = JSON.parse(user);
        isCurrentUser = (userData.id === loggedInUser.id);

        // Clear selected_user to avoid persisting between navigations
        localStorage.removeItem("selected_user");
    } else {
        userData = JSON.parse(user);
    }

    const elements = {
        name: document.querySelector("#user-name-full"),
        email: document.querySelector("#user-email"),
        bio: document.querySelector("#user-id-school-number"),
        image: document.querySelector("#img-profile")
    };

    // Only show edit button if viewing your own profile
    const editBtn = document.getElementById("edit-profile-btn");
    if (editBtn) {
        editBtn.style.display = isCurrentUser ? "block" : "none";
    }

    // Add a back button if viewing someone else's profile
    if (!isCurrentUser) {
        const backBtn = document.createElement("button");
        backBtn.className = "btn btn-outline-secondary ms-2";
        backBtn.textContent = "Back to List";
        backBtn.onclick = function () {
            window.location.href = "/pages/home/home.html";
        };

        if (editBtn && editBtn.parentNode) {
            editBtn.parentNode.appendChild(backBtn);
        }
    }

    populateUserData(userData, elements);

    // Set profile image based on role
    const imgEl = document.querySelector("#img-profile");
    if (userData.role == "ADMIN" && imgEl) {
        imgEl.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfJd8GSrBKC5rkiuwyqorIs8LJboDjI2IYw&s";
    }

    // Setup logout functionality
    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
}

function populateUserData(userData, elements) {
    // Display name
    if (elements.name) {
        const firstName = userData.user.name ? userData.user.name.split(" ")[0] : null;
        const lastName = userData.user.name ? userData.user.name.split(" ").slice(1).join(" ") : null;
        elements.name.textContent = userData.display_name ||
            `${firstName || "SERVER ERROR: no first name"} ${lastName || "SERVER ERROR: no last name"}`.trim() ||
            "User";
    }

    // Email
    if (elements.email) {
        elements.email.textContent = userData.user.email || "SERVER ERROR: no email found";
    }

    // Bio
    if (elements.bio) {
        elements.bio.textContent = userData.user.id_school_number || "SERVER ERROR: no ID number found";
    }

    // Profile Image
    // TODO: if multer is added
    /* if (elements.image) {
        if (userData.profile_image) {
            elements.image.src = userData.profile_image;
            elements.image.alt = `${userData.display_name || 'User'}'s profile picture`;
        } else if (userData.role === "ADMIN") {
            elements.image.src = "/assets/images/admin-default.png";
            elements.image.alt = "Admin profile picture";
        } else {
            elements.image.src = "/assets/images/default-profile.png";
            elements.image.alt = "Default profile picture";
        }
        
        // Add error handler for image loading failures
        elements.image.onerror = function() {
            console.warn("Failed to load profile image, using fallback");
            this.src = "/assets/images/default-profile.png";
        };
    } */
}

initProfile();
