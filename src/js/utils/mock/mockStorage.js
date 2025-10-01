// Import initial mock data
import { members as initialMembers, events as initialEvents, user as initialUser } from '/js/utils/mock/data.js';

const STORAGE_KEY = 'ccsync_mock_data';

function initMockData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error("Error parsing stored mock data:", error);
            return getDefaultData();
        }
    }
    return getDefaultData();
}

function getDefaultData() {
    return {
        members: [...initialMembers.members],
        events: [...initialEvents.events],
        user: { ...initialUser.user }
    };
}

function saveMockData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStorage));
        console.log('[MOCK] Data saved to localStorage.');
    } catch (error) {
        console.error("Error saving mock data to localStorage:", error);
    }
}

let mockStorage = initMockData();

/**
 * Get all members
 */
export function getMembers() {
    console.log("[MOCK] getMembers called, returning members:", mockStorage.members.length);
    return {
        message: "Members retrieved successfully",
        members: mockStorage.members
    };
}

/**
 * Add a new member
 */
export function addMember(memberData) {
    const newMember = {
        id: mockStorage.members.length > 0
            ? Math.max(...mockStorage.members.map(m => m.id)) + 1
            : 1,
        ...memberData
    };

    mockStorage.members.push(newMember);
    saveMockData();
    console.log("[MOCK] addMember called, new member added:", newMember);

    return {
        success: true,
        member: newMember
    };
}

/**
 * Update a member
 */
export function updateMember(id, memberData) {
    const index = mockStorage.members.findIndex(m => m.id === id);
    if (index === -1) {
        throw new Error('Member not found');
    }
    mockStorage.members[index] = { ...mockStorage.members[index], ...memberData };
    saveMockData();
    console.log("[MOCK] updateMember called, member updated:", mockStorage.members[index]);

    return {
        success: true,
        member: mockStorage.members[index]
    };
}

/**
 * Delete a member
 */
export function deleteMember(id) {
    const index = mockStorage.members.findIndex(m => m.id === id);
    if (index === -1) {
        throw new Error('Member not found');
    }

    mockStorage.members.splice(index, 1);
    saveMockData();

    return { success: true };
}

/**
 * Get all events
 */
export function getEvents() {
    return {
        message: "Events retrieved successfully",
        events: mockStorage.events
    };
}

/**
 * Add a new event
 */
export function addEvent(eventData) {
    const newEvent = {
        id: mockStorage.events.length + 1,
        ...eventData
    };

    mockStorage.events.push(newEvent);
    saveMockData();
    console.log("[MOCK] addEvent called, new event added:", newEvent);

    return {
        success: true,
        event: newEvent
    };
}

/**
 * Update an event
 */
export function updateEvent(id, eventData) {
    const index = mockStorage.events.findIndex(e => e.id === id);
    if (index === -1) {
        throw new Error('Event not found');
    }

    mockStorage.events[index] = { ...mockStorage.events[index], ...eventData };
    saveMockData();
    console.log("[MOCK] updateEvent called, event updated:", mockStorage.events[index]);

    return {
        success: true,
        event: mockStorage.events[index]
    };
}

/**
 * Delete an event
 */
export function deleteEvent(id) {
    const index = mockStorage.events.findIndex(e => e.id === id);
    if (index === -1) {
        throw new Error('Event not found');
    }

    mockStorage.events.splice(index, 1);
    saveMockData();

    return { success: true };
}

/**
 * Reset mock data
 */
export function resetMockData() {
    mockStorage = getDefaultData();
    saveMockData();
    console.log("[MOCK] Mock data reset to initial state.");
}

/**
 * Clear all mock data from localStorage
 */
export function clearMockData() {
    localStorage.removeItem(STORAGE_KEY);
    mockStorage = getDefaultData();
    console.log("[MOCK] Mock data cleared from localStorage.");
}