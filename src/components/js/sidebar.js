import '/components/scss/sidebar.scss';

// Toggle sub-navigation
document.querySelectorAll(".toggle-nav").forEach((item) => {
    item.addEventListener("click", function () {
        const subNav = this.nextElementSibling;

        // Toggle the open class on the parent element
        let parent = this.parentElement;
        parent.classList.toggle("open");

        // Toggle the show class on the sub-navigation
        subNav.classList.toggle("show");
    });
});

// Handle all navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        // Don't prevent default for toggle-nav links, they need to toggle
        if (!this.classList.contains("toggle-nav")) {
            e.preventDefault();
        }

        // Remove active class from all links
        document.querySelectorAll(".nav-link").forEach((l) => {
            l.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");

        // If this is a sub-nav item, also activate its parent menu
        if (this.closest(".sub-nav")) {
            const parentToggle =
                this.closest(".sub-nav").previousElementSibling;

            if (parentToggle) {
                parentToggle.classList.add("active");

                // Make sure sub-menu stays open when item is selected
                const parentItem = this.closest(".nav-item");

                if (parentItem) {
                    parentItem.classList.add("open");
                    this.closest(".sub-nav").classList.add(
                        "show"
                    );
                }
            }
        }
    });
});

// Initial state - check if URL hash matches any nav link and activate it
const hash = window.location.hash;

if (hash) {
    const targetLink = document.querySelector(
        `a.nav-link[href="${hash}"]`
    );

    if (targetLink) {
        // Simulate click to set active states properly
        targetLink.click();
    }
}

export function setSidebar(item) {
    const selectedItem = item || 'Home';

    // Sidebar container
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('sidebar', 'd-flex', 'flex-column', 'flex-shrink-0', 'bg-body-tertiary');
    sidebar.style.width = '280px';
    sidebar.style.height = '100vh';
    if (!sidebar) return;

    // Sidebar HTML structure (matches new home page design)
    sidebar.innerHTML = `
        <div class="d-flex justify-content-center align-items-center mb-3">
            <a class="navbar-brand d-flex" href="/">
                <img src="/assets/PSITSlogo.png" alt="Logo" class="sidebar-logo me-2" />
            </a>
        </div>
        <div class="px-5" style="opacity: 0.3;">
            <hr />
        </div>
        <div class="sidebar-nav-wrapper">
            <ul class="nav flex-column mb-auto gap-2 px-3">
                <li class="nav-item">
                    <a href="#" class="nav-link justify-content-start text-decoration-none ${selectedItem === 'Home' ? 'active' : ''}" aria-current="page">
                        <i class="bi bi-circle-fill pe-none me-2"></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link d-flex justify-content-start align-items-center text-decoration-none toggle-nav link-body-emphasis">
                        <div class="me-auto">Member Management</div>
                        <i class="bi bi-chevron-right nav-caret"></i>
                    </a>
                    <div class="sub-nav">
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'Register Member' ? ' active' : ''}">Register Member</a>
                        </div>
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'View Members' ? ' active' : ''}">View Members</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link d-flex justify-content-start align-items-center text-decoration-none toggle-nav link-body-emphasis">
                        <div class="me-auto">Event Management</div>
                        <i class="bi bi-chevron-right nav-caret"></i>
                    </a>
                    <div class="sub-nav">
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'Create Event' ? ' active' : ''}">Create Event</a>
                        </div>
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'View Events' ? ' active' : ''}">View Events</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link d-flex justify-content-start align-items-center text-decoration-none toggle-nav link-body-emphasis">
                        <div class="me-auto">Requirement Management</div>
                        <i class="bi bi-chevron-right nav-caret"></i>
                    </a>
                    <div class="sub-nav">
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'Add Requirement' ? ' active' : ''}">Add Requirement</a>
                        </div>
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'View Requirements' ? ' active' : ''}">View Requirements</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link d-flex justify-content-start align-items-center text-decoration-none toggle-nav link-body-emphasis">
                        <div class="me-auto">Officer Management</div>
                        <i class="bi bi-chevron-right nav-caret"></i>
                    </a>
                    <div class="sub-nav">
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'Add Officer' ? ' active' : ''}">Add Officer</a>
                        </div>
                        <div class="sub-nav-item">
                            <a href="#" class="nav-link${selectedItem === 'View Officers' ? ' active' : ''}">View Officers</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="user-info dropdown d-flex justify-content-between align-items-center px-4 py-3">
            <div>
                <strong>UNKNOWN USER</strong>
                <small>unknown role user</small>
            </div>
            <a href="#" class="more-btn text-decoration-none px-2 py-1 align-items-center" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="bi bi-gear-fill"></i>
            </a>
            <ul class="dropdown-menu text-small shadow">
                <li><a class="dropdown-item" href="#">New project...</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
        </div>
    `;

}