// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Import mock functions for fallback
import { getMembers, getEvents, getUser } from '/js/utils/mock/mockStorage.js';

/**
 * Generic API fetch with mock fallback
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise} - API response or mock data
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API call to ${url} failed, falling back to mock data:`, error.message);

        // Fallback to mock data based on endpoint
        return getMockData(endpoint);
    }
}

/**
 * Get mock data based on endpoint
 * @param {string} endpoint - API endpoint
 * @returns {object} - Mock data
 */
function getMockData(endpoint) {
    if (endpoint.includes('/member')) {
        return getMembers();
    } else if (endpoint.includes('/events')) {
        return getEvents();
    } else if (endpoint.includes('/user')) {
        return getUser();
    } else {
        throw new Error(`No mock data available for endpoint: ${endpoint}`);
    }
}

// Export specific API functions
/**
 * Fetches members data from API or mock fallback.
 * @async
 * @function fetchMembers
 * @returns {Promise<object>} - Members data
 */
export async function fetchMembers() {
    return apiFetch('/member');
}

/**
 * Fetches events data from API or mock fallback.
 * @async
 * @function fetchEvents
 * @param {boolean} [upcoming=false] - Whether to fetch only upcoming events.
 * @returns {Promise<object>} - Events data
 */
export async function fetchEvents(upcoming = false) {
    const query = upcoming ? '?upcoming=true' : '';
    return apiFetch(`/events${query}`);
}

/**
 * Fetches user data from API or mock fallback.
 * @async
 * @function fetchUser
 * @returns {Promise<object>} - User data
 */
export async function fetchUser() {
    return apiFetch('/user');
}

export { API_BASE_URL };
