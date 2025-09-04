import '/scss/components/sidebar.scss';

export function setSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Create overlay div for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    sidebar.parentNode.insertBefore(overlay, sidebar.nextSibling);

    // Function to handle screen size changes
    const handleScreenSize = () => {
        const isMobile = window.innerWidth < 992;

        // On mobile/tablet: default is collapsed
        // On desktop: use localStorage preference or default to expanded
        if (isMobile) {
            sidebar.classList.add('collapsed');
        } else {
            // For desktop, respect the user's preference from localStorage
            const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        }
    };

    // Set initial state
    handleScreenSize();

    // Toggle sidebar when button is clicked
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');

        // Only store preference on desktop
        if (window.innerWidth >= 992) {
            localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
        }
    });

    // Click on overlay should collapse sidebar on mobile
    overlay.addEventListener('click', function () {
        if (window.innerWidth < 992) {
            sidebar.classList.add('collapsed');
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleScreenSize);
}