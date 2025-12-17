/**
 * Event API endpoints
 */

import { request } from './api.js';

/**
 * Fetches all events
 * @async
 * @param {boolean} [upcoming=false] - Whether to fetch only upcoming events
 * @returns {Promise<object>} - Events data
 */
export async function fetchEvents(upcoming = false) {
    const query = upcoming ? '?upcoming=true' : '';
    return request(`/events${query}`, {
        method: 'GET',
    });
}

/**
 * Fetches events for the current month
 * @async
 * @returns {Promise<object>} - This month's events
 */
export async function fetchThisMonthEvents() {
    return request('/events?current=true', {
        method: 'GET',
    });
}

/**
 * Creates a new event
 * @async
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
 * @param {string} [eventData.status] - Event status
 * @returns {Promise<object>} - Created event data with ID
 * @throws {Error} - If event creation fails
 */
export async function createEvent(eventData) {
    return request('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
}

/**
 * Updates an existing event
 * @async
 * @param {number|string} eventId - Event ID to update
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
 * @throws {Error} - If event update fails
 */
export async function updateEvent(eventId, eventData) {
    return request(`/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
    });
}

/**
 * Fetches a specific event by ID
 * @async
 * @param {number|string} eventId - Event ID
 * @returns {Promise<object>} - Event data with participants
 * @throws {Error} - If event not found
 */
export async function fetchEvent(eventId) {
    return request(`/events/${eventId}`, {
        method: 'GET',
    });
}

/**
 * Fetches event participants with pagination
 * @async
 * @param {number|string} eventId - Event ID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Items per page
 * @returns {Promise<object>} - Participants data with pagination
 * @throws {Error} - If fetch fails
 */
export async function fetchEventParticipants(eventId, page = 1, limit = 20) {
    return request(`/events/${eventId}/participants?page=${page}&limit=${limit}`, {
        method: 'GET',
    });
}

/**
 * Registers a participant for an event
 * @async
 * @param {number|string} eventId - Event ID
 * @param {object} registrationData - Registration data
 * @param {number|string} registrationData.member_id - Member ID
 * @returns {Promise<object>} - Registration confirmation
 * @throws {Error} - If registration fails
 */
export async function registerEventParticipant(eventId, registrationData) {
    return request(`/events/${eventId}/participants`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
    });
}

/**
 * Marks a participant as attended
 * @async
 * @param {number|string} eventId - Event ID
 * @param {number|string} participantId - Participant ID
 * @returns {Promise<object>} - Updated participant data
 * @throws {Error} - If marking fails
 */
export async function markParticipantAttended(eventId, participantId) {
    return request(`/events/${eventId}/participants/${participantId}/attended`, {
        method: 'PUT',
        body: JSON.stringify({}),
    });
}

/**
 * Removes a participant from an event
 * @async
 * @param {number|string} eventId - Event ID
 * @param {number|string} participantId - Participant ID
 * @returns {Promise<object>} - Deletion confirmation
 * @throws {Error} - If removal fails
 */
export async function removeEventParticipant(eventId, participantId) {
    return request(`/events/${eventId}/participants/${participantId}`, {
        method: 'DELETE',
    });
}
