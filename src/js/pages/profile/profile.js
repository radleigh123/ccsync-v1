import '/js/utils/core.js';
import '/scss/pages/profile/profile.scss';
import { setSidebar } from "/components/js/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";
import { fetchUser } from "/js/utils/api.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";

let userData = null;
let userProfile = null;

/**
 * Initializes the profile page by checking user authentication and setting up the profile view.
 * @async
 * @function initProfile
 * @returns {Promise<void>}
 */
export async function initProfile() {
    // Check for logged in user
    userData = await getCurrentSession();
    if (!userData) {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    // Load layout-content
    try {
        const response = await fetch('/pages/profile/layout-content.html');
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Error loading profile content', error);
    }

    // Continue with existing profile logic
    await setupProfile();
    setupListeners();
}

async function setupProfile() {
    try {
        const params = new URLSearchParams();
        const userId = JSON.parse(localStorage.getItem("user")).id;
        params.append("id", userId);

        const response = await fetch(`https://ccsync-api-plain-dc043.wasmer.app/profile/getProfile.php?${params}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${userData.firebase_token}`,
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        userProfile = data.userProfile;

        console.log(userProfile);

        const elements = {
            name: document.querySelector("#user-name-full"),
            email: document.querySelector("#user-email"),
            bio: document.querySelector("#user-bio"),
            image: document.querySelector("#img-profile")
        };
        populateUserData(userProfile, elements);

        // Set profile image based on role
        const imgEl = document.querySelector("#img-profile");
        if (userData.role == "ADMIN" && imgEl) {
            imgEl.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfJd8GSrBKC5rkiuwyqorIs8LJboDjI2IYw&s";
        }
    } catch (error) {
        console.error('Error fetching user profile', error);
    }
}

function populateUserData(userData, elements) {
    // Display name
    if (elements.name) {
        elements.name.textContent = userData.display_name || `${userData.first_name} ${userData.last_name}`.trim();
    }

    // Email
    if (elements.email) {
        elements.email.textContent = userData.email || "SERVER ERROR: no email found";
    }

    // Bio
    if (elements.bio) {
        elements.bio.textContent = userData.bio || "SERVER ERROR: no ID number found";
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

function setupListeners() {
    document.getElementById('edit-profile-btn').addEventListener('click', (e) => {
        window.location.href = "/pages/settings/settings.html";
    });
}

initProfile();
