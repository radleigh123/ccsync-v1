import '/js/utils/core';
import '/scss/pages/dashboard/dashboard.scss';

document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.getElementById('content-area');

    // Check if sidebar collapsed state is stored in localStorage
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');

        // Store state in localStorage
        localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });

    // Profile Load
    const profileTabBtn = document.getElementById('v-pills-profile-tab');
    const profilePane = document.getElementById('v-pills-profile');
    let profileLoaded = false;

    // FIXME: On Build, SCRIPT PATH IS UNKNOWN
    const PROFILE_HTML_PATH = '/ccsync-v1/pages/profile/profile.html';
    const PROFILE_SCRIPT_SRC = '/ccsync-v1/js/pages/profile/profile.js';

    async function loadProfileIntoPane() {
        if (profileLoaded) return;
        try {
            const res = await fetch(PROFILE_HTML_PATH, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch profile: ' + res.status);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Prefer <main>, fallback to .container or body
            const fragment = doc.querySelector('main') || doc.querySelector('.container') || doc.body;
            profilePane.innerHTML = fragment ? fragment.innerHTML : html;

            // Dynamically import profile module and call its init function (works after injection)
            try {
                const module = await import(PROFILE_SCRIPT_SRC);
                if (module && typeof module.initProfile === 'function') {
                    module.initProfile();
                }
            } catch (impErr) {
                // Fallback: if import path differs on server, attempt to append script tag
                if (!document.querySelector(`script[src="${PROFILE_SCRIPT_SRC}"]`)) {
                    const s = document.createElement('script');
                    s.type = 'module';
                    s.src = PROFILE_SCRIPT_SRC;
                    s.defer = true;
                    document.body.appendChild(s);
                }
            }

            profileLoaded = true;
        } catch (err) {
            console.error(err);
            profilePane.innerHTML = '<p class="text-danger">Failed to load profile.</p>';
        }
    }

    profileTabBtn.addEventListener('click', loadProfileIntoPane);
    profileTabBtn.addEventListener('shown.bs.tab', loadProfileIntoPane);

    if (profileTabBtn.classList.contains('active')) {
        loadProfileIntoPane();
    }

    // Home/Dashboard Load
    const homeTabBtn = document.getElementById('v-pills-home-tab');
    const homePane = document.getElementById('v-pills-home');
    let homeLoaded = false;

    const HOME_HTML_PATH = '/ccsync-v1/pages/home/home.html';
    const HOME_SCRIPT_SRC = '/ccsync-v1/js/pages/home/home.js';

    async function loadHomeIntoPane() {
        if (homeLoaded) return;
        try {
            const res = await fetch(HOME_HTML_PATH, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch home content: ' + res.status);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Prefer <main>, fallback to .container or body
            const fragment = doc.querySelector('main') || doc.querySelector('.container') || doc.body;
            homePane.innerHTML = fragment ? fragment.innerHTML : html;

            // Dynamically import home module and call its init function
            try {
                const module = await import(HOME_SCRIPT_SRC);
                if (module && typeof module.initHome === 'function') {
                    module.initHome();
                }
            } catch (impErr) {
                // Fallback: if import path differs on server, attempt to append script tag
                if (!document.querySelector(`script[src="${HOME_SCRIPT_SRC}"]`)) {
                    const s = document.createElement('script');
                    s.type = 'module';
                    s.src = HOME_SCRIPT_SRC;
                    s.defer = true;
                    document.body.appendChild(s);
                }
            }

            homeLoaded = true;
        } catch (err) {
            console.error(err);
            homePane.innerHTML = '<p class="text-danger">Failed to load dashboard content.</p>';
        }
    }

    if (homeTabBtn) {
        homeTabBtn.addEventListener('click', loadHomeIntoPane);
        homeTabBtn.addEventListener('shown.bs.tab', loadHomeIntoPane);

        // Load home content if it's the active tab on page load
        if (homeTabBtn.classList.contains('active')) {
            loadHomeIntoPane();
        }
    }

    const logout = document.querySelector("#v-pills-logout-tab");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
});
