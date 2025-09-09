import '/js/utils/core.js';
import '/scss/pages/settings/settings.scss';
import { Tab } from "bootstrap";
import { setSidebar } from "/components/js/sidebar.js";
import { setupFloatingNav } from "/components/js/floating_button.js";
import { setupLogout } from "/js/utils/navigation.js";
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { accountForm } from './forms/account';
import { passwordForm } from './forms/password';
import { profileForm } from "./forms/profile";
import { profileImgForm } from "./forms/profileImg";

export function initSettings() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
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

    populateUserData(
        JSON.parse(user),
        {
            email: document.getElementById('email'),
            displayName: document.getElementById('display-name'),
            bio: document.getElementById('bio'),
            phone: document.querySelector('#phone'),
            gender: document.getElementById('gender')
        });
    setupFormHandlers();
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
            `${userData.name_first || ''} ${userData.name_last || ''}`.trim() || '';
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
    const userData = JSON.parse(localStorage.getItem("user") || '{}');

    // Initialize intl-tel-input for phone number field
    const phoneInput = document.querySelector('#phone');
    const iti = setupTelInput(userData, phoneInput);

    accountForm(userData, document.getElementById('account-info-form'), iti);

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

    if (userData.phone) {
        setTimeout(() => {
            try {
                iti.setNumber(userData.phone);

                if (!userData.phone.startsWith('+')) {
                    iti.setNumber(`+${userData.phone}`);
                }
            } catch (e) {
                console.warn('Error setting phone number in iti:', e);
                phoneInput.value = userData.phone;
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

document.addEventListener("DOMContentLoaded", () => {
    initSettings();
    setupLogout();
    setSidebar();
    setupFloatingNav();
});