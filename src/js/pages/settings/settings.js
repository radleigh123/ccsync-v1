import '/js/utils/core.js';
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import '/scss/pages/settings/settings.scss';
import { Tab } from "bootstrap";
import { setSidebar } from "/components/js/sidebar.js";
import { setupFloatingNav } from "/components/js/floating_button.js";
import { setupLogout } from "/js/utils/navigation.js";

export function initSettings() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);
    const elements = {
        email: document.getElementById('email'),
        displayName: document.getElementById('display-name'),
        bio: document.getElementById('bio'),
        phone: document.querySelector('#phone'),
        gender: document.getElementById('gender')
    };

    populateUserData(userData, elements);

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
    // Initialize intl-tel-input for phone number field
    const phoneInput = document.querySelector('#phone');
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

    const userData = JSON.parse(localStorage.getItem("user") || '{}');
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

    const accountInfoForm = document.getElementById('account-info-form');
    if (accountInfoForm) {
        accountInfoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            let phoneNumber = '';

            if (iti) {
                try {
                    phoneNumber = iti.isValidNumber() ? iti.getNumber() : '';
                } catch (e) {
                    console.warn('Error getting phone number from iti:', e);
                    phoneNumber = phoneInput.value; // Fallback to raw input
                }
            }

            const gender = document.getElementById('gender').value;

            if (!email) {
                alert('Please provide an email address');
                return;
            }

            // NOTE: API to update
            alert('Account information update functionality will be implemented in the future');
            console.log(JSON.stringify({ email, phoneNumber, gender }));

            // Update local storage example
            // const user = JSON.parse(localStorage.getItem('user') || '{}');
            // user.email = email;
            // user.phone = phone;
            // user.gender = gender;
            // localStorage.setItem('user', JSON.stringify(user));
        });
    }

    // Password update form handler
    const passwordForm = document.getElementById('current-password')?.closest('.card');
    if (passwordForm) {
        const updatePasswordBtn = passwordForm.querySelector('.btn-primary');
        updatePasswordBtn?.addEventListener('click', function (e) {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            // NOTE: call API to update
            alert('Password update functionality will be implemented in the future');
            console.log(JSON.stringify({ currentPassword, newPassword }));
        });
    }

    // Profile update form handler
    const profileForm = document.getElementById('profile-form');
    profileForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const displayName = document.getElementById('display-name').value;
        const bio = document.getElementById('bio').value;

        if (!displayName) {
            alert('Please provide a display name');
            return;
        }

        // NOTE: call API to update
        alert('Profile update functionality will be implemented in the future');
        console.log(JSON.stringify({ displayName, bio }));

        // Update local storage example
        // const user = JSON.parse(localStorage.getItem('user') || '{}');
        // user.displayName = displayName;
        // user.bio = bio;
        // localStorage.setItem('user', JSON.stringify(user));
    });

    // Profile image upload handler
    const profileImageForm = document.getElementById('profile-image-form');
    profileImageForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('profile-image');
        if (fileInput.files.length === 0) {
            alert('Please select an image to upload');
            return;
        }

        const file = fileInput.files[0];

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // NOTE: call API to update, maybe multer
        alert('Profile image upload functionality will be implemented in the future');
    });

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

document.addEventListener("DOMContentLoaded", () => {
    initSettings();
    setupLogout();
    setSidebar();
    setupFloatingNav();
});