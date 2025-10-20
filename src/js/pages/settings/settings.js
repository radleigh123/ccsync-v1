import '/js/utils/core.js';
import '/scss/pages/settings/settings.scss';
import { Tab } from "bootstrap";
import { setSidebar } from "/components/js/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { accountForm } from '/js/pages/settings/forms/account.js';
import { passwordForm } from '/js/pages/settings/forms/password.js';
import { profileForm } from "/js/pages/settings/forms/profile.js";
import { profileImgForm } from "/js/pages/settings/forms/profileImg.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";

let userData = null;
let userProfile = null;

/**
 * Initializes the settings page by checking user authentication and setting up the settings interface.
 * @async
 * @function initSettings
 * @returns {Promise<void>}
 */
export async function initSettings() {
    userData = await getCurrentSession();
    if (!userData) {
        window.location.href = "/pages/auth/login.html";
        return;
    }

    // Load layout-content
    try {
        const response = await fetch('/pages/settings/layout-content.html');
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Error loading settings content', error);
    }

    // Handle tab switching via URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab');

    if (activeTab) {
        const tab = document.querySelector(`#${activeTab}-tab`);
        if (tab) {
            const tabInstance = new Tab(tab);
            tabInstance.show();
        }
    }

    // Continue with existing settings logic
    await setupSettingsData();
    setupFormHandlers();
}

/**
 * Sets up the settings page by populating user data and initializing form handlers.
 * @async
 * @function setupSettingsData
 * @returns {Promise<void>}
 */
async function setupSettingsData() {
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
            email: document.getElementById('email'),
            displayName: document.getElementById('display-name'),
            bio: document.getElementById('bio'),
            phone: document.querySelector('#phone'),
            gender: document.getElementById('gender')
        };
        populateUserData(userProfile, elements);
    } catch (error) {
        console.error('Error fetching user profile', error);
    }
}

function populateUserData(userData, elements) {
    // Email
    if (elements.email) {
        elements.email.value = userData.email || '';
    }

    // Phone Number handled separately after iti initialization

    // Display Name
    if (elements.displayName) {
        elements.displayName.value = userData.display_name ||
            `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || '';
    }

    // Bio
    if (elements.bio) {
        elements.bio.value = userData.bio || '';
    }

    // Gender (select dropdown)
    if (elements.gender) {
        const genderValue = (userData.gender || '').toLowerCase();

        const options = elements.gender.options;
        let optionFound = false;

        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toLowerCase() === genderValue ||
                options[i].text.toLowerCase() === genderValue) {
                elements.gender.selectedIndex = i;
                optionFound = true;
                break;
            }
        }

        // If no matching option was found, you can set a default value or handle it as needed
        if (!optionFound && genderValue) {
            console.warn(`Gender value "${genderValue}" not found in options.`);
        }
    }
}

function setupFormHandlers() {
    // const userData = JSON.parse(localStorage.getItem("user") || '{}');

    // Initialize intl-tel-input for phone number field
    const phoneInput = document.querySelector('#phone');
    const iti = setupTelInput(userProfile, phoneInput);

    accountForm(userProfile, document.getElementById('account-info-form'), iti);

    const updatePasswordBtn = document.getElementById('update-password-btn');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    passwordForm(
        userData,
        document.getElementById('current-password')?.closest('.card'),
        updatePasswordBtn,
        {
            currentPassword,
            newPassword,
            confirmPassword
        });

    profileForm(userData, document.getElementById('profile-form'));
    profileImgForm(userData, document.getElementById('profile-image-form'));

    // For tab changes to update URL
    const tabEls = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', event => {
            const id = event.target.id.replace('-tab', '');
            const url = new URL(window.location);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url);
        });
    });
}

function setupTelInput(userData, phoneInput) {
    const iti = intlTelInput(phoneInput, {
        loadUtils: () => import("intl-tel-input/utils"),
        separateDialCode: true,
        formatOnDisplay: true,
        initialCountry: "auto",
        preferredCountries: ["ph", "us", "gb", "au"],
        geoIpLookup: function (callback) {
            callback("ph");
        }
    });

    const phoneNumber = String(userData.phone_number)

    if (phoneNumber) {
        setTimeout(() => {
            try {
                iti.setNumber(phoneNumber);

                if (!phoneNumber.startsWith('+')) {
                    iti.setNumber(`+${phoneNumber}`);
                }
            } catch (e) {
                console.warn('Error setting phone number in iti:', e);
                phoneInput.value = phoneNumber;
            }
        }, 100);
    }

    phoneInput.addEventListener('blur', function () {
        if (phoneInput.value.trim()) {
            if (iti.isValidNumber()) {
                phoneInput.classList.remove('is-invalid');
                phoneInput.classList.add('is-valid');
            } else {
                phoneInput.classList.remove('is-valid');
                phoneInput.classList.add('is-invalid');
            }
        } else {
            phoneInput.classList.remove('is-valid', 'is-invalid');
        }
    });

    return iti;
}

// Initialize settings
initSettings();