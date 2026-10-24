/* turns "2026-06-02" into a Date at midnight UTC, so it's the same day for every visitor */
function toUtcDate(value: string): Date {
    return new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
}


const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
})


export function formatMonthYear(isoDate: string): string {
    return monthYearFormatter.format(toUtcDate(isoDate));
}


const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
})


export type DateParts = {
    day: string
    month: string
    year: string
}


/* splits "2026-06-02" into { day: "02", month: "Jun", year: "2026" }. */
export function getDateParts(isoDate: string): DateParts {
    const parts = shortDateFormatter.formatToParts(toUtcDate(isoDate));
    const find = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? '';

    return { day: find('day'), month: find('month'), year: find('year') };
}


const longDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
})

export function formatLongDate(isoDate: string): string {
    return longDateFormatter.format(toUtcDate(isoDate));
}