const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Makes an authenticated API request with centralized token handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {object} [options.headers] - Additional headers to merge
 * @param {object|FormData} [options.body] - Request body
 * 
 * @returns {Promise<object>} - Parsed JSON response
 * @throws {Error} - If request fails or response is not ok
 */
export async function request(endpoint, options = {}) {
    const url = `${VITE_API_BASE_URL}${endpoint}`;

    // Get Firebase token from localStorage
    const userStr = localStorage.getItem('user');
    let token = '';

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            token = user.firebase_token || user.token || '';
        } catch (e) {
            console.warn('Failed to parse user from localStorage:', e);
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {}),
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Handle non-OK responses
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = `API error: ${response.status}`;

            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    console.warn('Failed to parse error response as JSON:', e);
                }
            }
            throw new Error(errorMessage);
        }

        // Parse response as JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            throw new Error('API response is not JSON');
        }
    } catch (error) {
        console.error(`API request failed [${options.method || 'GET'} ${url}]:`, error.message);
        throw error;
    }
}

export { VITE_API_BASE_URL };
