import { auth, refreshToken, needsTokenRefresh } from "./firebaseAuth.js";

/**
 * Initialize session management
 * Call this on app startup (e.g., in core.js)
 */
export function initSessionManager() {
    // Set up auth state listener
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            // User is signed out
            localStorage.removeItem('user');
            return;
        }

        // User is signed in, refresh token if needed
        if (needsTokenRefresh()) {
            try {
                await refreshToken();
            } catch (error) {
                console.error("Failed to refresh token:", error);
            }
        }
    });
}

/**
 * Check if session is valid and refresh token if needed
 * Call this before accessing protected resources
 * @returns {Promise<boolean>} True if session is valid
 */
export async function ensureValidSession() {
    return new Promise(resolve => {
        auth.onAuthStateChanged(async (user) => {
            if (!user || !localStorage.getItem('user')) {
                resolve(false);
                return;
            }
            if (needsTokenRefresh()) {
                try {
                    await refreshToken();
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                    resolve(false);
                    return;
                }
            }
            resolve(true);
        });
    });
}

/**
 * Get current session data with fresh token
 * @returns {Promise<Object|null>} User data with fresh token or null
 */
export async function getCurrentSession() {
    if (await ensureValidSession()) {
        return JSON.parse(localStorage.getItem('user'));
    }
    return null;
}

export async function isAdmin(userData, redirectUrl = "/ccsync-v1/pages/home/home.html") {
    const userRole = userData?.role || 'user';

    if (userRole !== 'admin') return false;

    return true;
}