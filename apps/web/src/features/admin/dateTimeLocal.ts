/**
 * <input type="datetime-local"> works with strings like "2026-12-01T09:30"
 * in the *visitor's own timezone*, with no timezone written in them.
 * The API stores UTC ISO strings like "2026-12-01T17:30:00.000Z".
 * These two helpers convert between the formats.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-12-01T17:30:00.000Z" -> "2026-12-01T09:30" (if you're in Los Angeles) */
export function toDateTimeLocal(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "2026-12-01T09:30" -> "2026-12-01T17:30:00.000Z". a string with no timezone is read as local time. */
export function fromDateTimeLocal(value: string): string {
    return new Date(value).toISOString();
}