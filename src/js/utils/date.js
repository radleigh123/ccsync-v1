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