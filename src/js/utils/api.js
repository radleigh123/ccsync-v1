// API configuration and utilities
// Use relative path for API calls - works with any host/port configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            // Try to parse error response as JSON
            const contentType = response.headers.get('content-type');
            let errorMessage = `API request failed: ${response.status}`;
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use the default error message
                }
            }
            
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            throw new Error('API response is not JSON');
        }
    } catch (error) {
        // For POST requests (create/update/delete), don't use mock data - throw the error
        if (options.method && options.method.toUpperCase() !== 'GET') {
            throw error;
        }
        
        console.warn(`API call to ${url} failed, falling back to mock data:`, error.message);

        // Fallback to mock data based on endpoint (only for GET requests)
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
    const token = getToken();

    // return apiFetch('/member');
    return apiFetch('/members', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
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
    return apiFetch(`/events${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

/**
 * Fetches user data from API or mock fallback.
 * @async
 * @function fetchUser
 * @returns {Promise<object>} - User data
 */
export async function fetchUser() {
    return apiFetch('/ccsync-api-plain/user/getUser.php');
}

/**
 * Fetches all users (CCS Students) from API.
 * @async
 * @function fetchUsers
 * @returns {Promise<object>} - Users data with total count
 */
export async function fetchUsers() {
    return apiFetch('/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

/**
 * Fetches events for the current month from API.
 * @async
 * @function fetchThisMonthEvents
 * @returns {Promise<object>} - This month's events
 */
export async function fetchThisMonthEvents() {
    // NOTE: remind the backend to make documentation for APIs
    return apiFetch('/events?current=true', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

/**
 * Creates a new event
 * @async
 * @function createEvent
 * @param {object} eventData - Event data
 * @param {string} eventData.name - Event name
 * @param {string} eventData.description - Event description
 * @param {string} eventData.venue - Event venue
 * @param {string} eventData.event_date - Event date (YYYY-MM-DD)
 * @param {string} eventData.time_from - Start time (HH:MM:SS)
 * @param {string} eventData.time_to - End time (HH:MM:SS)
 * @param {string} [eventData.registration_start] - Registration start date
 * @param {string} [eventData.registration_end] - Registration end date
 * @param {number} [eventData.max_participants] - Maximum participants
 * @param {string} [eventData.status] - Event status (default: 'open')
 * @returns {Promise<object>} - Created event data with ID
 */
export async function createEvent(eventData) {
    try {
        const token = localStorage.getItem('user') ?
            JSON.parse(localStorage.getItem('user')).firebase_token : '';

        console.log("event data:", eventData);

        return await apiFetch('/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

    } catch (error) {
        console.error("🚨 Create event API error:", error);
        throw error;
    }
}

/**
 * Updates an existing event
 * @async
 * @function updateEvent
 * @param {number} eventId - Event ID to update
 * @param {object} eventData - Event data to update
 * @param {string} eventData.name - Event name
 * @param {string} eventData.description - Event description
 * @param {string} eventData.venue - Event venue
 * @param {string} eventData.event_date - Event date (YYYY-MM-DD)
 * @param {string} eventData.time_from - Start time (HH:MM:SS)
 * @param {string} eventData.time_to - End time (HH:MM:SS)
 * @param {string} [eventData.registration_start] - Registration start date
 * @param {string} [eventData.registration_end] - Registration end date
 * @param {number} [eventData.max_participants] - Maximum participants
 * @returns {Promise<object>} - Updated event data
 */
export async function updateEvent(eventId, eventData) {
    try {
        const token = localStorage.getItem('user') ?
            JSON.parse(localStorage.getItem('user')).firebase_token : '';

        console.log("📝 Updating event:", eventId, eventData);

        return await apiFetch(`/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

    } catch (error) {
        console.error("🚨 Update event API error:", error);
        throw error;
    }
}

/**
 * Create a new requirement
 * @param {object} requirementData - Requirement data
 * @returns {Promise} - API response
 */
export async function createRequirement(requirementData) {
    try {
        const token = getToken();

        console.log("requirement data:", requirementData);

        return await apiFetch('/ccsync-api-plain/requirement/createRequirement.php', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requirementData)
        });

    } catch (error) {
        console.error("🚨 Create requirement API error:", error);
        throw error;
    }
}

// TODO: temporary method, apply KISS
const getToken = () => JSON.parse(localStorage.getItem('user')).firebase_token ?? '';

export { API_BASE_URL };
