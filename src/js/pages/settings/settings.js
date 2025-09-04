import '/js/utils/core.js';
import '/scss/pages/settings/settings.scss';
import { setSidebar } from "/js/utils/components/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";
import { setupFloatingNav } from '../../utils/components/floating_button';

export function initSettings() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
        return;
    }

    const userData = JSON.parse(user);

    // Populate user data in form fields if available
    if (userData.email) {
        document.getElementById('email').value = userData.email;
    }

    if (userData.displayName) {
        document.getElementById('display-name').value = userData.displayName;
    }

    if (userData.bio) {
        document.getElementById('bio').value = userData.bio;
    }

    if (userData.phone) {
        document.getElementById('phone').value = userData.phone;
    }

    if (userData.gender) {
        document.getElementById('gender').value = userData.gender;
    }

    // Handle tab switching via URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab');

    if (activeTab) {
        // Try to activate the requested tab
        const tab = document.querySelector(`#${activeTab}-tab`);
        if (tab) {
            const tabInstance = new bootstrap.Tab(tab);
            tabInstance.show();
        }
    }

    // Set up form submission handlers
    setupFormHandlers();
}

function setupFormHandlers() {
    // Account info form handler
    const accountInfoForm = document.getElementById('account-info-form');
    if (accountInfoForm) {
        accountInfoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const gender = document.getElementById('gender').value;

            // Simple validation
            if (!email) {
                alert('Please provide an email address');
                return;
            }

            // Here you would typically call an API to update account info
            alert('Account information update functionality will be implemented in the future');

            // Update local storage for demo purposes
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.email = email;
            user.phone = phone;
            user.gender = gender;
            localStorage.setItem('user', JSON.stringify(user));
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

            // Simple validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            // Here you would typically call an API to update the password
            alert('Password update functionality will be implemented in the future');
        });
    }

    // Profile update form handler
    const profileForm = document.getElementById('profile-form');
    profileForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const displayName = document.getElementById('display-name').value;
        const bio = document.getElementById('bio').value;

        // Simple validation
        if (!displayName) {
            alert('Please provide a display name');
            return;
        }

        // Here you would typically call an API to update the profile
        alert('Profile update functionality will be implemented in the future');

        // Update local storage for demo purposes
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.displayName = displayName;
        user.bio = bio;
        localStorage.setItem('user', JSON.stringify(user));
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

        // Here you would typically upload the file to a server
        alert('Profile image upload functionality will be implemented in the future');
    });

    // Add event listeners for tab changes to update URL
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