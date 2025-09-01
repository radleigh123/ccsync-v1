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

    // Lazy-load
    const profileTabBtn = document.getElementById('v-pills-profile-tab');
    const profilePane = document.getElementById('v-pills-profile');
    let profileLoaded = false;

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

    const logout = document.querySelector("#v-pills-logout-tab");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
});
