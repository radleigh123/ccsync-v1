import '/components/scss/floating_button.scss';

export function setupFloatingNav() {
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'floating-action-btn';
    floatingBtn.id = 'floating-nav-btn';
    floatingBtn.innerHTML = '<i class="bi bi-list"></i>';
    document.body.appendChild(floatingBtn);

    const navCard = document.createElement('div');
    navCard.className = 'nav-card';
    navCard.innerHTML = `
        <div class="card-header">Navigation</div>
        <div class="list-group list-group-flush">
            <a href="/ccsync-v1/pages/home/home.html" class="list-group-item list-group-item-action ${window.location.pathname.includes('/home/') ? 'active' : ''}">
                <i class="bi bi-house-door"></i>Home
            </a>
            <a href="/ccsync-v1/pages/profile/profile.html" class="list-group-item list-group-item-action ${window.location.pathname.includes('/profile/') ? 'active' : ''}">
                <i class="bi bi-person"></i>Profile
            </a>
            <a href="/ccsync-v1/pages/settings/settings.html" class="list-group-item list-group-item-action ${window.location.pathname.includes('/settings/') ? 'active' : ''}">
                <i class="bi bi-gear"></i>Settings
            </a>
            <a id="floating-logout" href="#" class="list-group-item list-group-item-action">
                <i class="bi bi-box-arrow-in-left"></i>Logout
            </a>
        </div>
    `;
    document.body.appendChild(navCard);

    // Fix: Stop event propagation to prevent document click handler from firing
    floatingBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // This is the key fix
        navCard.classList.toggle('visible');
    });

    // Close navigation card when clicking outside
    document.addEventListener('click', (event) => {
        if (!navCard.contains(event.target) && event.target !== floatingBtn) {
            navCard.classList.remove('visible');
        }
    });

    // Also stop propagation on the card itself to prevent it from closing when clicked
    navCard.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Add logout functionality to the floating logout button
    const floatingLogout = document.getElementById('floating-logout');
    if (floatingLogout) {
        floatingLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = '/';
        });
    }

    const sidebar = document.getElementById('sidebar');

    // Function to update button visibility based on both sidebar state AND screen size
    const updateFloatingButtonVisibility = () => {
        if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('collapsed')) {
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
            navCard.classList.remove('visible');
        }
    };

    // Initial check
    updateFloatingButtonVisibility();

    // Create a MutationObserver to watch for sidebar class changes
    const observer = new MutationObserver(() => {
        updateFloatingButtonVisibility();
    });

    if (sidebar) {
        observer.observe(sidebar, { attributes: true });
    }

    // Update on window resize
    window.addEventListener('resize', updateFloatingButtonVisibility);
}