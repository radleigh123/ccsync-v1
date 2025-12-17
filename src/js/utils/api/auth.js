/**
 * Authentication API endpoints
 */

import { request } from './api.js';

/**
 * Login with email and password
 * @async
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Login response with user data and tokens
 * @throws {Error} - If login fails
 */
export async function login(email, password) {
    return request('/auth/login', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, password }),
    });
}

/**
 * Register a new user
 * @async
 * @param {object} userData - User registration data
 * @param {string} userData.first_name - First name
 * @param {string} userData.last_name - Last name
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.password_confirmation - Password confirmation
 * @param {string} userData.id_school_number - School ID number
 * @returns {Promise<object>} - Registration response
 * @throws {Error} - If registration fails
 */
export async function register(userData) {
    return request('/auth/register', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(userData),
    });
}

/**
 * Send password reset email
 * @async
 * @param {string} email - User email
 * @returns {Promise<object>} - Response confirming email sent
 * @throws {Error} - If request fails
 */
export async function sendPasswordReset(email) {
    return request('/auth/send-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

/**
 * Verify Firebase token
 * @async
 * @param {string} token - Firebase ID token
 * @returns {Promise<object>} - Token verification response
 * @throws {Error} - If verification fails
 */
export async function verifyToken(token) {
    return request('/auth/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
    });
}
