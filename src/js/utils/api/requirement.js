/**
 * Requirement API endpoints
 */

import { request } from './api.js';

/**
 * Creates a new requirement
 * @async
 * @param {object} requirementData - Requirement data
 * @returns {Promise<object>} - Created requirement data
 * @throws {Error} - If requirement creation fails
 */
export async function createRequirement(requirementData) {
    return request('/ccsync-api-plain/requirement/createRequirement', {
        method: 'POST',
        body: JSON.stringify(requirementData),
    });
}

/**
 * Fetches all requirements with pagination
 * @async
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Items per page
 * @returns {Promise<object>} - Requirements data with pagination
 * @throws {Error} - If fetch fails
 */
export async function fetchRequirements(page = 1, limit = 20) {
    return request(`/requirements?page=${page}&limit=${limit}`, {
        method: 'GET',
    });
}

/**
 * Fetches a specific requirement by ID
 * @async
 * @param {number|string} requirementId - Requirement ID
 * @returns {Promise<object>} - Requirement data
 * @throws {Error} - If requirement not found
 */
export async function fetchRequirement(requirementId) {
    return request(`/requirements/${requirementId}`, {
        method: 'GET',
    });
}

/**
 * Fetches compliance records for a requirement with pagination
 * @async
 * @param {number|string} requirementId - Requirement ID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Items per page
 * @returns {Promise<object>} - Compliance records with pagination
 * @throws {Error} - If fetch fails
 */
export async function fetchComplianceRecords(requirementId, page = 1, limit = 20) {
    return request(`/requirements/${requirementId}/compliance?page=${page}&limit=${limit}`, {
        method: 'GET',
    });
}

/**
 * Records compliance for a member to a requirement
 * @async
 * @param {number|string} requirementId - Requirement ID
 * @param {object} complianceData - Compliance data
 * @param {number|string} complianceData.member_id - Member ID
 * @param {string} [complianceData.status] - Compliance status
 * @returns {Promise<object>} - Compliance record confirmation
 * @throws {Error} - If recording fails
 */
export async function recordCompliance(requirementId, complianceData) {
    return request(`/requirements/${requirementId}/compliance`, {
        method: 'POST',
        body: JSON.stringify(complianceData),
    });
}

/**
 * Updates a requirement
 * @async
 * @param {number|string} requirementId - Requirement ID
 * @param {object} requirementData - Requirement data to update
 * @returns {Promise<object>} - Updated requirement data
 * @throws {Error} - If update fails
 */
export async function updateRequirement(requirementId, requirementData) {
    return request(`/requirements/${requirementId}`, {
        method: 'PUT',
        body: JSON.stringify(requirementData),
    });
}

/**
 * Deletes a requirement
 * @async
 * @param {number|string} requirementId - Requirement ID
 * @returns {Promise<object>} - Deletion confirmation
 * @throws {Error} - If deletion fails
 */
export async function deleteRequirement(requirementId) {
    return request(`/requirements/${requirementId}`, {
        method: 'DELETE',
    });
}
