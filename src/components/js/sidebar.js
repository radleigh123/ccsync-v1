import '/components/scss/sidebar.scss';
import { Tooltip } from "bootstrap";
import { setupLogout } from "/js/utils/navigation.js";

// Menu configuration based on user role
const menuConfig = {
    admin: [
        {
            type: 'link',
            href: '/pages/home/home.html',
            title: 'Dashboard',
            icon: 'bi bi-house-fill',
            text: 'Dashboard',
            active: true
        },
        {
            type: 'dropdown',
            title: 'Member management',
            icon: 'bi bi-person-circle',
            text: 'Member management',
            submenu: [
                { href: '/pages/home/member/view-member.html', text: 'View members' },
                { href: '/pages/home/member/register-member.html', text: 'Register member' }
            ]
        },
        {
            type: 'dropdown',
            title: 'Event management',
            icon: 'bi bi-calendar2-week-fill',
            text: 'Event management',
            submenu: [
                { href: '/pages/home/event/view-event.html', text: 'View events' },
                { href: '/pages/home/event/add-event.html', text: 'Add event' }
            ]
        },
        {
            type: 'dropdown',
            title: 'Requirement management',
            icon: 'bi bi-file-text-fill',
            text: 'Requirement management',
            submenu: [
                { href: '/pages/home/requirement/view-requirement.html', text: 'View requirements' },
                { href: '/pages/home/requirement/add-requirement.html', text: 'Add requirement' }
            ]
        },
        {
            type: 'dropdown',
            title: 'Officer management',
            icon: 'bi bi-hdd-rack-fill',
            text: 'Officer management',
            submenu: [
                { href: '/pages/home/officer/view-officer.html', text: 'View officers' },
                { href: '/pages/home/officer/add-officer.html', text: 'Add officer' }
            ]
        }
    ],
    user: [
        {
            type: 'link',
            href: '/pages/home/student/student-dashboard.html',
            title: 'Dashboard',
            icon: 'bi bi-house-fill',
            text: 'Dashboard',
            active: true
        }
    ]
};

// Function to generate menu HTML
/**
 * Generates HTML string for sidebar menu items based on the provided configuration.
 * @function generateMenuHTML
 * @param {Array} menuItems - Array of menu item objects with type, href, title, etc.
 * @returns {string} The generated HTML string for the menu.
 */
function generateMenuHTML(menuItems) {
    return menuItems.map(item => {
        if (item.type === 'link') {
            return `
                <li class="${item.active ? 'active' : ''}">
                    <a href="${item.href}" class="justify-content-center" title="${item.title}" data-bs-toggle="tooltip" data-bs-placement="right">
                        <i class="${item.icon}" style="font-size: 16px"></i>
                        <span>${item.text}</span>
                    </a>
                </li>
            `;
        } else if (item.type === 'dropdown') {
            return `
                <li>
                    <button class="dropdown-btn justify-content-center" data-bs-toggle="tooltip" data-bs-placement="right" title="${item.title}">
                        <i class="${item.icon}"></i>
                        <span>${item.text}</span>
                    </button>
                    <ul class="sub-menu">
                        <div class="me-auto" style="padding-left: 40px">
                            ${item.submenu.map(sub => `<li><a href="${sub.href}" class="px-2">${sub.text}</a></li>`).join('')}
                        </div>
                    </ul>
                </li>
            `;
        }
    }).join('');
}

/**
 * Loads the sidebar template, generates role-based menu, and sets up functionality.
 * @async
 * @function setSidebar
 * @returns {Promise<void>}
 */
export async function setSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Fetch the sidebar template
    try {
        const response = await fetch('/components/html/sidebar.html');
        if (!response.ok) throw new Error('Failed to load sidebar template');
        const template = await response.text();
        sidebar.innerHTML = template;
    } catch (error) {
        console.error('Error loading sidebar template:', error);
        return;
    }

    // Get user role
    const user = JSON.parse(localStorage.getItem("user"))?.user || {};
    const userRole = user.role || 'user';

    // Generate and insert menu items
    const menuItems = menuConfig[userRole] || menuConfig.user;
    console.log('Sidebar menu items for role:', userRole, menuItems);
    const menuHTML = generateMenuHTML(menuItems);
    console.log('Generated sidebar HTML:', menuHTML);
    const menuContainer = document.getElementById('sidebar-menu');
    if (menuContainer) {
        menuContainer.innerHTML = menuHTML;
    }

    // Set user info
    const userName = user.name || 'USER NAME';
    const userId = user.id_school_number || 'ID NUMBER';
    setUserInfo(userName, userId);

    // Now set up the sidebar functionality
    setupSidebarFunctionality();
}

/**
 * Sets up event listeners and functionality for the sidebar, including toggle, dropdowns, and tooltips.
 * @function setupSidebarFunctionality
 */
function setupSidebarFunctionality() {
    const toggleButton = document.getElementById('toggle-btn')
    const sidebar = document.getElementById('sidebar')
    const dropdownButton = document.querySelectorAll('.dropdown-btn')
    const menuItems = sidebar.querySelectorAll('li > a, .dropdown-btn')
    const isMobile = () => window.innerWidth <= 800

    setupLogout(); // initialize logout functionality

    // Initialize tooltips for desktop
    if (!isMobile()) {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            try {
                new Tooltip(tooltipTriggerEl)
            } catch (error) {
                console.warn('Tooltip initialization failed:', error);
            }
        })
    }

    const sidebarListItems = sidebar.querySelectorAll('li');

    // Helper to dispose all tooltips
    /**
     * Disposes of all active Bootstrap tooltips to prevent memory leaks.
     * @function disposeAllTooltips
     */
    function disposeAllTooltips() {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            try {
                const tooltipInstance = Tooltip.getInstance(tooltipTriggerEl);
                if (tooltipInstance) {
                    tooltipInstance.dispose();
                }
            } catch (error) {
                // Silently ignore if tooltip doesn't exist
            }
        });
    }

    // Add mouseleave listener to each li
    sidebarListItems.forEach(li => {
        li.addEventListener('mouseleave', disposeAllTooltips);
    });

    // Setup gear icon dropdown
    const gearIcon = document.querySelector('.more-btn');
    if (gearIcon) {
        gearIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const userInfo = gearIcon.closest('.user-info');
            const dropdownMenu = userInfo?.querySelector('.dropdown-menu');
            
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
                console.log('✓ Dropdown menu toggled, show class:', dropdownMenu.classList.contains('show'));
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userInfo = gearIcon.closest('.user-info');
            const dropdownMenu = userInfo?.querySelector('.dropdown-menu');
            
            if (dropdownMenu && !userInfo?.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }



    /**
     * Toggles the sidebar open/close state and closes all submenus.
     * @function toggleSidebar
     */
    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        toggleButton.classList.toggle('rotate')
        closeAllSubMenus()
    }

    /**
     * Toggles the visibility of a submenu for a dropdown button.
     * @function toggleSubMenu
     * @param {HTMLElement} button - The dropdown button element.
     */
    function toggleSubMenu(button) {
        closeAllSubMenusExcept(button)

        button.nextElementSibling.classList.toggle('show')
        button.classList.toggle('rotate')
        if (sidebar.classList.contains("collapsed")) {
          sidebar.classList.toggle("collapsed");
          toggleButton.classList.toggle("rotate");
        }
    }

    /**
     * Closes all open submenus in the sidebar.
     * @function closeAllSubMenus
     */
    function closeAllSubMenus() {
        Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
            ul.classList.remove('show')
            ul.previousElementSibling.classList.remove('rotate')
        })
    }

    /**
     * Closes all open submenus except the one associated with the specified button.
     * @function closeAllSubMenusExcept
     * @param {HTMLElement} exceptButton - The button whose submenu should remain open.
     */
    function closeAllSubMenusExcept(exceptButton) {
        Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
            if (ul.previousElementSibling !== exceptButton) {
                ul.classList.remove('show')
                ul.previousElementSibling.classList.remove('rotate')
            }
        })
    }

    /**
     * Sets the active state for a menu item and removes active state from others.
     * @function setActiveMenuItem
     * @param {HTMLElement} item - The menu item element to set as active.
     */
    function setActiveMenuItem(item) {
        menuItems.forEach(menuItem => {
            if (menuItem.tagName === 'A') {
                menuItem.closest('li').classList.remove('active')
                menuItem.classList.remove('active')
            } else {
                menuItem.classList.remove('active')
                const icon = menuItem.querySelector('i')
                if (icon) {
                    icon.classList.remove('active-icon')
                }
            }
        })

        if (isMobile()) {
            closeAllSubMenusExcept(item.closest('.sub-menu') ? item.closest('.sub-menu').previousElementSibling : null)
        }

        if (item.tagName === 'A') {
            item.classList.add('active')
            item.closest('li').classList.add('active')

            const parentSubmenu = item.closest('.sub-menu')
            if (parentSubmenu) {
                parentSubmenu.classList.add('show')

                const parentButton = parentSubmenu.previousElementSibling
                if (parentButton && parentButton.classList.contains('dropdown-btn')) {
                    parentButton.classList.add('active')
                    parentButton.classList.add('rotate')

                    const parentIcon = parentButton.querySelector('i')
                    if (parentIcon) {
                        parentIcon.classList.add('active-icon')
                    }
                }
            }
        } else {
            item.classList.add('active')

            const icon = item.querySelector('i')
            if (icon) {
                icon.classList.add('active-icon')
            }
        }

        const href = item.getAttribute('href')
        const text = item.textContent.trim()
        console.log(`Active menu item set to: ${text} (${href})`);

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

                if (window.innerWidth <= 800 && item.closest('.sub-menu')) {
                    closeAllSubMenus()
                }
            })
        }
    })

    /**
     * Sets the active menu item based on the current URL or stored href in localStorage.
     * @function setActiveFromCurrentUrl
     */
    function setActiveFromCurrentUrl() {
        const currentPath = window.location.pathname
        const storedHref = localStorage.getItem('ccsync_active_sidebar_href')
        let activeItem = null

        menuItems.forEach(item => {
            const href = item.getAttribute('href')
            if (href && href !== '#' && currentPath === href) {
                activeItem = item
                return
            }
        })

        if (!activeItem) {
            menuItems.forEach(item => {
                const href = item.getAttribute('href')
                if (href && href !== '#' && currentPath.includes(href)) {
                    if (!activeItem || href.length > activeItem.getAttribute('href').length) {
                        activeItem = item
                    }
                }
            })
        }

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
                    parentButton.classList.add('active')
                    parentButton.classList.add('rotate')

                    const parentIcon = parentButton.querySelector('i')
                    if (parentIcon) {
                        parentIcon.classList.add('active-icon')
                    }
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
        // if (window.innerWidth < 1320 && !sidebar.classList.contains('close')) {
        //     toggleSidebar()
        // }

        // if (window.innerWidth < 800 && sidebar.classList.contains('close')) {
        //     toggleSidebar()
        // }

         if (window.innerWidth <= 991) {
           sidebar.classList.add("collapsed");
         } else {
           sidebar.classList.remove("collapsed");
         }
    })

    if (isMobile()) {
        document.addEventListener('click', (e) => {
            if (isMobile() &&
                !e.target.closest('.dropdown-btn') &&
                !e.target.closest('.sub-menu') &&
                sidebar.querySelector('.sub-menu.show')) {
                closeAllSubMenus()
            }
        })
    }
}

/**
 * Sets the user name and ID in the sidebar user info section.
 * @function setUserInfo
 * @param {string} name - The user's name.
 * @param {string} id - The user's ID.
 */
function setUserInfo(name, id) {
    const userName = document.getElementById('user-name');
    const userId = document.getElementById('user-id');

    if (userName) userName.textContent = name;
    if (userId) userId.textContent = id;
}
