/**
 * User API endpoints
 */

import { request } from './api.js';

/**
 * Fetches current user data
 * @async
 * @returns {Promise<object>} - Current user data
 */
export async function fetchUser() {
    return request('/ccsync-api-plain/user/getUser', {
        method: 'GET',
    });
}

/**
 * Fetches all CCS students/users
 * @async
 * @returns {Promise<object>} - Users data with total count
 */
export async function fetchUsers() {
    return request('/users', {
        method: 'GET',
    });
}

/**
 * Fetches a specific user by ID
 * @async
 * @param {number|string} userId - User ID
 * @returns {Promise<object>} - User data
 * @throws {Error} - If user not found
 */
export async function getUser(userId) {
    return request(`/users/${userId}`, {
        method: 'GET',
    });
}

/**
 * Updates user profile information
 * @async
 * @param {number|string} userId - User ID
 * @param {object} profileData - Profile data to update
 * @param {string} [profileData.display_name] - Display name
 * @param {string} [profileData.biography] - User biography
 * @param {string} [profileData.email] - Email address
 * @param {string} [profileData.phone_number] - Phone number
 * @param {string} [profileData.gender] - Gender
 * @returns {Promise<object>} - Updated user data
 * @throws {Error} - If update fails
 */
export async function updateUserProfile(userId, profileData) {
    return request(`/profile/${userId}/editProfileInfo`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
}

/**
 * Updates user account information
 * @async
 * @param {number|string} userId - User ID (member ID)
 * @param {object} accountData - Account data to update
 * @param {string} [accountData.email] - Email address
 * @param {string} [accountData.phone] - Phone number
 * @param {string} [accountData.gender] - Gender
 * @returns {Promise<object>} - Updated account data
 * @throws {Error} - If update fails
 */
export async function updateUserAccount(userId, accountData) {
    return request(`/profile/${userId}/edit`, {
        method: 'PUT',
        body: JSON.stringify(accountData),
    });
}

/**
 * Updates user password
 * @async
 * @param {number|string} userId - User ID
 * @param {object} passwordData - Password data
 * @param {string} passwordData.current_password - Current password
 * @param {string} passwordData.password - New password
 * @param {string} passwordData.password_confirmation - Confirm new password
 * @returns {Promise<object>} - Response confirming password update
 * @throws {Error} - If password update fails
 */
export async function updatePassword(userId, passwordData) {
    return request(`/profile/${userId}/editPassword`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    });
}

/**
 * Fetches a user by school ID
 * @async
 * @param {string} idSchoolNumber - School ID number
 * @returns {Promise<object>} - User data
 * @throws {Error} - If user not found
 */
export async function fetchUserBySchoolId(idSchoolNumber) {
    return request(`/user?id_school_number=${encodeURIComponent(idSchoolNumber)}`, {
        method: 'GET',
    });
}
