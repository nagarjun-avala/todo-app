/**
 * Checks if a task recurs monthly on the same day,
 * adjusting for month lengths and leap years.
 *
 * @param baseDate - The original creation date of the task
 * @param targetDate - The date being checked
 * @returns true if the task should recur on targetDate
 */
export function isMonthlyOccurrence(baseDate: Date, targetDate: Date): boolean {
    const baseDay = baseDate.getDate();
    const baseMonth = baseDate.getMonth(); // 0-11
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth(); // 0-11
    const targetDay = targetDate.getDate();

    const isLeapYear = (year: number) =>
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    // Special case: created on Feb 29
    if (baseMonth === 1 && baseDay === 29) {
        if (isLeapYear(targetYear)) {
            return targetDay === 29 && targetMonth === 1;
        } else {
            return targetDay === 28 && targetMonth === 1;
        }
    }

    // If baseDay is greater than the last day of target month, shift to last day
    if (baseDay > lastDayOfTargetMonth) {
        return targetDay === lastDayOfTargetMonth;
    }

    // Normal case: same date
    return targetDay === baseDay;
}
