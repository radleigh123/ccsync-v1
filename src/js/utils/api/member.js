/**
 * Member and Officer API endpoints
 */

import { request } from './api.js';

/**
 * Fetches all members
 * @async
 * @returns {Promise<object>} - Members data
 */
export async function fetchMembers() {
    return request('/members', {
        method: 'GET',
    });
}

/**
 * Searches for members by query
 * @async
 * @param {string} query - Search query
 * @returns {Promise<object>} - Search results
 */
export async function searchMembers(query) {
    return request(`/members/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
    });
}

/**
 * Fetches a specific member by ID
 * @async
 * @param {number|string} id - Member ID
 * @returns {Promise<object>} - Member data
 */
export async function fetchMember(id) {
    return request(`/members/${id}`, {
        method: 'GET',
    });
}

/**
 * Fetches all officers
 * @async
 * @returns {Promise<object>} - Officers data
 */
export async function fetchOfficers() {
    return request('/officers', {
        method: 'GET',
    });
}

/**
 * Promotes a member to an officer role
 * @async
 * @param {number|string} memberId - Member ID to promote
 * @param {string} role - Role to promote to
 * @returns {Promise<object>} - Updated member data
 */
export async function promoteOfficer(memberId, role) {
    return request(`/role/${memberId}/promote`, {
        method: 'POST',
        body: JSON.stringify({ role }),
    });
}

/**
 * Demotes an officer back to member role
 * @async
 * @param {number|string} memberId - Member ID to demote
 * @returns {Promise<object>} - Updated member data
 */
export async function demoteOfficer(memberId) {
    return request(`/role/${memberId}/demote`, {
        method: 'POST',
        body: JSON.stringify({ role: 'student' }),
    });
}

/**
 * Registers a new member
 * @async
 * @param {object} memberData - Member registration data
 * @param {number|string} memberData.id_school_number - School ID number
 * @param {string} [memberData.birth_date] - Birth date
 * @param {string} [memberData.year_level] - Year level
 * @param {string} [memberData.program] - Program/major
 * @param {boolean} [memberData.is_paid] - Payment status
 * @returns {Promise<object>} - Created member data
 * @throws {Error} - If registration fails
 */
export async function createMember(memberData) {
    return request('/members', {
        method: 'POST',
        body: JSON.stringify(memberData),
    });
}

/**
 * Fetches a member by school ID
 * @async
 * @param {string} idSchoolNumber - School ID number
 * @returns {Promise<object>} - Member data
 * @throws {Error} - If member not found
 */
export async function fetchMemberBySchoolId(idSchoolNumber) {
    return request(`/members/member?id_school_number=${encodeURIComponent(idSchoolNumber)}`, {
        method: 'GET',
    });
}
