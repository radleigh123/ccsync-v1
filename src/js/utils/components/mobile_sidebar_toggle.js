// Mobile sidebar toggle functionality
export function setupMobileSidebarToggle() {
    // Create the toggle button element
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-sidebar-toggle d-lg-none';
    toggleButton.id = 'mobile-sidebar-toggle';
    toggleButton.innerHTML = '<i class="bi bi-list"></i>';
    document.body.appendChild(toggleButton);

    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', function () {
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    });

    // Handle overlay click to collapse sidebar
    if (overlay) {
        overlay.addEventListener('click', function () {
            if (sidebar) {
                sidebar.classList.add('collapsed');
            }
        });
    }

    // Handle window resize to collapse sidebar on mobile
    window.addEventListener('resize', function () {
        if (window.innerWidth < 992 && sidebar && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
        }
    });
}
