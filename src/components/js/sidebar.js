import '/components/scss/sidebar.scss';
import { Tooltip } from "bootstrap";
import { setupLogout } from "/js/utils/navigation.js";

export function setSidebar() {
    const toggleButton = document.getElementById('toggle-btn')
    const sidebar = document.getElementById('sidebar')
    const dropdownButton = document.querySelectorAll('.dropdown-btn')
    const menuItems = sidebar.querySelectorAll('li > a, .dropdown-btn')
    const isMobile = () => window.innerWidth <= 800

    setupLogout(); // initialize logout functionality

    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new Tooltip(tooltipTriggerEl)
    })

    const sidebarListItems = sidebar.querySelectorAll('li');

    // Helper to dispose all tooltips
    function disposeAllTooltips() {
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            const tooltipInstance = Tooltip.getInstance(tooltipTriggerEl);
            if (tooltipInstance) {
                tooltipInstance.dispose();
            }
        });
    }

    // Add mouseleave listener to each li
    sidebarListItems.forEach(li => {
        li.addEventListener('mouseleave', disposeAllTooltips);
    });


    function toggleSidebar() {
        sidebar.classList.toggle('close')
        toggleButton.classList.toggle('rotate')
        closeAllSubMenus()
    }

    function toggleSubMenu(button) {
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
        if (window.innerWidth < 1320 && !sidebar.classList.contains('close')) {
            toggleSidebar()
        }

        if (window.innerWidth < 800 && sidebar.classList.contains('close')) {
            toggleSidebar()
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

    // Set user info
    const user = JSON.parse(localStorage.getItem("user")).user || {};

    const userName = user.name || 'USER NAME';
    const userId = user.id_school_number || 'ID NUMBER';
    setUserInfo(userName, userId);

    // Configure sidebar based on role
    const userRole = user.role || 'user';
    if (userRole === 'user') { // Student role
        // Hide all dropdown menus and sub-menus for students
        const dropdowns = sidebar.querySelectorAll('.dropdown-btn');
        dropdowns.forEach(btn => {
            btn.style.display = 'none';
            const ul = btn.nextElementSibling;
            if (ul && ul.classList.contains('sub-menu')) {
                ul.style.display = 'none';
            }
        });
    }
}

function setUserInfo(name, id) {
    const userName = document.getElementById('user-name');
    const userId = document.getElementById('user-id');

    if (userName) userName.textContent = name;
    if (userId) userId.textContent = id;
}
