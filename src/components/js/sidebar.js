import '/components/scss/sidebar.scss';
import { Tooltip } from "bootstrap";

export function setSidebar() {
    const toggleButton = document.getElementById('toggle-btn')
    const sidebar = document.getElementById('sidebar')
    const dropdownButton = document.querySelectorAll('.dropdown-btn')
    const menuItems = sidebar.querySelectorAll('li > a, .dropdown-btn')

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

        if (item.tagName === 'A') {
            item.classList.add('active')
            item.closest('li').classList.add('active')

            const parentSubmenu = item.closest('.sub-menu')
            closeAllSubMenusExcept(parentSubmenu ? parentSubmenu.previousElementSibling : null)

            if (parentSubmenu) {
                const parentButton = parentSubmenu.previousElementSibling
                if (parentButton && parentButton.classList.contains('dropdown-btn')) {
                    parentButton.classList.add('active')
                    parentButton.classList.add('rotate')
                    parentSubmenu.classList.add('show')

                    const parentIcon = parentButton.querySelector('i')
                    if (parentIcon) {
                        parentIcon.classList.add('active-icon')
                    }
                }
            }
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

