import { auth, refreshToken, needsTokenRefresh } from "./firebaseAuth.js";

// Flag to track if logout is in progress
window.isLoggingOut = false;

/**
 * Initialize session management
 * Call this on app startup (e.g., in core.js)
 */
export function initSessionManager() {
    // Set up auth state listener
    auth.onAuthStateChanged(async (user) => {
        // Don't restore session if logout is in progress
        if (window.isLoggingOut) {
            console.log("⏸️ Logout in progress, skipping session restoration");
            localStorage.removeItem('user');
            localStorage.removeItem('member');
            return;
        }

        if (!user) {
            // User is signed out
            console.log("👤 No Firebase user detected");
            localStorage.removeItem('user');
            localStorage.removeItem('member');
            return;
        }

        // User is signed in, refresh token if needed
        if (needsTokenRefresh()) {
            try {
                console.log("🔄 Refreshing auth token...");
                await refreshToken();
                console.log("✓ Token refreshed successfully");
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
        // Skip if logout is in progress
        if (window.isLoggingOut) {
            console.log("⏸️ Logout in progress, session validation skipped");
            resolve(false);
            return;
        }

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

export async function isAdmin(userData, redirectUrl = "/pages/home/home.html") {
    const userRole = userData?.role || 'user';

    if (userRole !== 'admin') return false;

    return true;
}