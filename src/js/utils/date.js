/** Helper functions for date/time formats */

/**
 * Format time to its format: HH:MM:SS.
 * @function
 * @param {String} time string time format.
 * @returns {String} The parsed time.
 */
export function parseTime(time) {
    // If time HH:MM
    if (/^\d{1,2}:\d{2}$/.test(time)) {
        return time + ":00";
    }

    // If time HH:MM:SS
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
        return time;
    }

    throw new Error("Invalid time format");
}

/**
 * Format date to its format: YYYY-MM-DD.
 * @function
 * @param {String} dateStr string date format.
 * @returns {String} The parsed date
 */
export function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1, day, 0, 0, 0, 0);

    return date;
};

/**
 * Get year suffix (st, nd, rd, th)
 */
export function getYearSuffix(year) {
    const yearNum = parseInt(year);
    switch (yearNum) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        case 4: return 'th';
        default: return '';
    }
}

/**
 * Format date to readable format
 */
export function formatDate(dateStr) {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}
