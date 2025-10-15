import '/js/utils/core.js';
import '/scss/styles.scss';
import { setSidebar } from "/components/js/sidebar.js";
import { setupLogout } from "/js/utils/navigation.js";

// Content mapping for different pages
const contentMap = {
    '/pages/home/home.html': '/pages/home/layout-content.html',
    '/pages/profile/profile.html': '/pages/profile/layout-content.html',
    '/pages/settings/settings.html': '/pages/settings/layout-content.html'
};

// JavaScript mapping for different pages
const scriptMap = {
    '/pages/home/home.html': '/js/pages/home/home.js',
    '/pages/profile/profile.html': '/js/pages/profile/profile.js',
    '/pages/settings/settings.html': '/js/pages/settings/settings.js'
};

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize sidebar
    await setSidebar();

    // Load initial content based on current URL
    await loadContentForCurrentPage();

    // Set up content navigation
    setupContentNavigation();
});

/**
 * Loads the appropriate content and script for the current page based on the URL path.
 * @async
 * @function loadContentForCurrentPage
 * @returns {Promise<void>}
 */
async function loadContentForCurrentPage() {
    const currentPath = window.location.pathname;
    const contentUrl = contentMap[currentPath];

    if (contentUrl) {
        await loadContent(contentUrl);

        // Load and execute the page-specific JavaScript
        const scriptUrl = scriptMap[currentPath];
        if (scriptUrl) {
            await loadScript(scriptUrl);
        }
    } else {
        console.error('No content mapping found for path:', currentPath);
    }
}

/**
 * Fetches and loads HTML content into the main content area.
 * @async
 * @function loadContent
 * @param {string} contentUrl - The URL of the content to load.
 * @returns {Promise<void>}
 */
async function loadContent(contentUrl) {
    try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status}`);
        }
        const content = await response.text();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = content;
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

/**
 * Fetches and executes a JavaScript module for the current page.
 * @async
 * @function loadScript
 * @param {string} scriptUrl - The URL of the script to load.
 * @returns {Promise<void>}
 */
async function loadScript(scriptUrl) {
    try {
        // Remove existing page script if it exists
        const existingScript = document.querySelector(`script[data-page-script]`);
        if (existingScript) {
            existingScript.remove();
        }

        // Load new script
        const response = await fetch(scriptUrl);
        if (!response.ok) {
            throw new Error(`Failed to load script: ${response.status}`);
        }
        const scriptContent = await response.text();

        // Create and execute the script
        const script = document.createElement('script');
        script.type = 'module';
        script.setAttribute('data-page-script', 'true');
        script.textContent = scriptContent;
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading script:', error);
    }
}

/**
 * Sets up event listeners for SPA navigation, intercepting link clicks and handling browser history.
 * @function setupContentNavigation
 */
function setupContentNavigation() {
    // Override default link behavior for sidebar links
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a[href]');
        if (link && contentMap[link.getAttribute('href')]) {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Update URL without page reload
            window.history.pushState({}, '', href);

            // Load new content
            await loadContentForCurrentPage();
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', async () => {
        await loadContentForCurrentPage();
    });
}
