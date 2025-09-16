import '/components/scss/sidebar.scss';

/**
 * CCSync Sidebar Navigation Handler
 * This script manages the sidebar navigation functionality including:
 * - Toggle sub-navigation (expand/collapse)
 * - Active state management based on current URL
 * - Persistent active state across page loads
 * - Support for both regular links and dropdown menus
 */

document.addEventListener('DOMContentLoaded', function () {

    // Toggle sub-navigation
    document.querySelectorAll(".toggle-nav").forEach((item) => {
        item.addEventListener("click", function (event) {
            const subNav = this.nextElementSibling;

            // Toggle the open class on the parent element
            let parent = this.parentElement;
            parent.classList.toggle("open");

            // Toggle the show class on the sub-navigation
            subNav.classList.toggle("show");

            // Don't navigate if this is just a toggle button
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                event.preventDefault();
            }
        }

        );
    }

    );

    // Handle all navigation links
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", function (e) {

            // Don't prevent default for toggle-nav links, they need to toggle
            if (!this.classList.contains("toggle-nav")) {
                // Store this active link in local storage for persistence
                setActiveNavItem(this.getAttribute('href'), this.textContent.trim());
            }

            // Remove active class from all links
            document.querySelectorAll(".nav-link").forEach((l) => {
                l.classList.remove("active");
            }

            );

            // Add active class to clicked link
            this.classList.add("active");

            // If this is a sub-nav item, also activate its parent menu
            if (this.closest(".sub-nav")) {
                const parentToggle = this.closest(".sub-nav").previousElementSibling;

                if (parentToggle) {
                    parentToggle.classList.add("active");

                    // Make sure sub-menu stays open when item is selected
                    const parentItem = this.closest(".nav-item");

                    if (parentItem) {
                        parentItem.classList.add("open");
                        this.closest(".sub-nav").classList.add("show");
                    }
                }
            }
        }

        );
    }

    );

    // Set active based on current URL or from stored selection
    setActiveFromCurrentUrl();
}

);

/**
 * Store the currently active navigation item
 * @param {string} href - The href attribute of the clicked link
 * @param {string} text - The text content of the clicked link
 */
function setActiveNavItem(href, text) {
    if (href && href !== '#') {
        localStorage.setItem('ccsync_active_nav_href', href);
        localStorage.setItem('ccsync_active_nav_text', text);
    }
}

/**
 * Set active menu item based on current URL path or stored selection
 */
function setActiveFromCurrentUrl() {
    const currentPath = window.location.pathname;
    const storedHref = localStorage.getItem('ccsync_active_nav_href');
    const hash = window.location.hash;

    // Try matching the current path first
    let targetLink = findLinkByPathOrHash(currentPath) || (hash && document.querySelector(`a.nav-link[href="${hash}"]`)) || (storedHref && document.querySelector(`a.nav-link[href="${storedHref}"]`));

    // If found, activate it
    if (targetLink) {
        targetLink.click();
    }

    else {
        // Default to first nav item if nothing matches
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink) firstNavLink.click();
    }
}

/**
 * Find a navigation link that matches or contains the given path
 * @param {string} path - The URL path to match against
 * @returns {Element|null} - The matching navigation link or null
 */
function findLinkByPathOrHash(path) {
    let matchingLink = null;
    let bestMatchLength = 0;

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        // Check for exact match first
        if (href === path) {
            matchingLink = link;
            bestMatchLength = path.length;
            return;
        }

        // Check if the path contains this href and it's longer than previous matches
        if (path.includes(href) && href.length > bestMatchLength) {
            matchingLink = link;
            bestMatchLength = href.length;
        }
    }

    );

    return matchingLink;
}

export function setSidebar() {
    const toggleButton = document.getElementById('toggle-btn')
    const sidebar = document.getElementById('sidebar')
    const dropdownButton = document.querySelectorAll('.dropdown-btn')
    const menuItems = sidebar.querySelectorAll('li > a, .dropdown-btn')

    function toggleSidebar() {
        sidebar.classList.toggle('close')
        toggleButton.classList.toggle('rotate')
        closeAllSubMenus()
    }

    function toggleSubMenu(button) {
        // Close all other submenus before toggling this one
        closeAllSubMenusExcept(button)

        button.nextElementSibling.classList.toggle('show')
        button.classList.toggle('rotate')
        if (sidebar.classList.contains('close')) {
            sidebar.classList.toggle('close')
            toggleButton.classList.toggle('rotate')
        }
    }

    function closeAllSubMenus() {
        Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
            ul.classList.remove('show')
            ul.previousElementSibling.classList.remove('rotate')
        })
    }

    function closeAllSubMenusExcept(exceptButton) {
        Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
            if (ul.previousElementSibling !== exceptButton) {
                ul.classList.remove('show')
                ul.previousElementSibling.classList.remove('rotate')
            }
        })
    }

    function setActiveMenuItem(item) {
        menuItems.forEach(menuItem => {
            if (menuItem.tagName === 'A') {
                menuItem.closest('li').classList.remove('active')
                menuItem.classList.remove('active')
            } else {
                menuItem.classList.remove('active')
            }
        })

        if (item.tagName === 'A') {
            item.classList.add('active')
            item.closest('li').classList.add('active')

            // Close all submenus except the one containing this item
            const parentSubmenu = item.closest('.sub-menu')
            closeAllSubMenusExcept(parentSubmenu ? parentSubmenu.previousElementSibling : null)
        } else {
            item.classList.add('active')
        }

        const parentSubmenu = item.closest('.sub-menu')
        if (parentSubmenu) {
            const parentButton = parentSubmenu.previousElementSibling
            if (parentButton && parentButton.classList.contains('dropdown-btn')) {
                parentButton.classList.add('active')
                parentButton.classList.add('rotate')
                parentSubmenu.classList.add('show')
            }
        }

        const href = item.getAttribute('href')
        const text = item.textContent.trim()
        if (href && href !== '#') {
            localStorage.setItem('ccsync_active_sidebar_href', href)
            localStorage.setItem('ccsync_active_sidebar_text', text)
        }
    }

    menuItems.forEach(item => {
        if (item.tagName === 'A') {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href')

                if (href === '#' || !href) {
                    e.preventDefault()
                }

                setActiveMenuItem(item)
            })
        }
    })

    function setActiveFromCurrentUrl() {
        const currentPath = window.location.pathname
        const storedHref = localStorage.getItem('ccsync_active_sidebar_href')
        let activeItem = null

        menuItems.forEach(item => {
            const href = item.getAttribute('href')
            if (href && href !== '#' && currentPath.includes(href)) {
                activeItem = item
            }
        })

        if (!activeItem && storedHref) {
            menuItems.forEach(item => {
                const href = item.getAttribute('href')
                if (href === storedHref) {
                    activeItem = item
                }
            })
        }

        if (!activeItem) {
            activeItem = sidebar.querySelector('li > a')
        }

        if (activeItem) {
            setActiveMenuItem(activeItem)

            const parentSubmenu = activeItem.closest('.sub-menu')
            if (parentSubmenu) {
                parentSubmenu.classList.add('show')

                const parentButton = parentSubmenu.previousElementSibling
                if (parentButton && parentButton.classList.contains('dropdown-btn')) {
                    parentButton.classList.add('rotate')
                }
            }
        }
    }

    setActiveFromCurrentUrl()

    toggleButton.addEventListener('click', () => toggleSidebar())
    dropdownButton.forEach(button => {
        button.addEventListener('click', () => toggleSubMenu(button))
    })

    window.addEventListener('resize', () => {
        if (window.innerWidth < 1320 && !sidebar.classList.contains('close')) {
            toggleSidebar()
        }

        if (window.innerWidth < 800 && sidebar.classList.contains('close')) {
            toggleSidebar()
        }
    })
}

