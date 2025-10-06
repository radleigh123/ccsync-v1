import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAt0tg_QWJKw5Ekhgs77xPLtTe2f42JPFc",
    authDomain: "ccsync-elphp-2025.firebaseapp.com",
    projectId: "ccsync-elphp-2025",
    storageBucket: "ccsync-elphp-2025.firebasestorage.app",
    messagingSenderId: "621497927422",
    appId: "1:621497927422:web:68b9acc2e43108942307af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export function isAuthenticated() {
    return new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe(); // Stop listening for changes
            resolve(!!user && !!localStorage.getItem('user'));
        });
    });
}

/**
 * Get current user data
 * @returns {Object|null} User data or null if not authenticated
 */
export function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Check if token needs refresh (tokens are valid for 1 hour)
 * @returns {boolean} True if token needs refresh, false otherwise
 */
export function needsTokenRefresh() {
    const userData = getCurrentUser();
    if (!userData || !userData.last_login) return true;

    const lastLogin = new Date(userData.last_login);
    const now = new Date();

    return now.getTime() - lastLogin.getTime() > 55 * 60 * 1000;
}

/**
 * Refresh the auth token
 * @returns {Promise<string} New ID token
 */
export async function refreshToken() {
    if (!auth.currentUser) {
        throw new Error("Not authenticated");
    }

    try {
        const idToken = await auth.currentUser.getIdToken(true);

        const userData = getCurrentUser();
        if (userData) {
            userData.firebase_token = idToken;
            userData.last_login = new Date().toISOString();
            localStorage.setItem('user', JSON.stringify(userData));
        }

        return idToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

/**
 * Logout the current user
 */
export async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        window.location.href = '/pages/login/login.html';
    } catch (error) {
        console.error("Error logging out:", error);
    }
}
