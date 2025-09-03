import '/scss/components/sidebar.scss';

export function setSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

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
}