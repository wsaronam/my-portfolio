import { describe, expect, it } from 'vitest'
import { fromDateTimeLocal, toDateTimeLocal } from './dateTimeLocal'




// these tests must pass in every timezone (laptop, a CI server in UTC...).
// instead of hard-coding "17:30Z", each test builds its date in *local* time
// with new Date(year, monthIndex, day, hours, minutes), just like the browser does

describe('toDateTimeLocal', () => {
    it('formats a moment as the local "YYYY-MM-DDTHH:mm" an input expects', () => {
        const localNineThirty = new Date(2026, 11, 1, 9, 30); // 1 Dec 2026, 09:30 local (months count from 0)
        expect(toDateTimeLocal(localNineThirty.toISOString())).toBe('2026-12-01T09:30');
    })

    it('pads single-digit months, days, hours and minutes', () => {
        const early = new Date(2027, 0, 5, 7, 3);
        expect(toDateTimeLocal(early.toISOString())).toBe('2027-01-05T07:03');
    })
})


describe('fromDateTimeLocal', () => {
    it('reads the value as local time and returns UTC ISO', () => {
        const expected = new Date(2026, 11, 1, 9, 30).toISOString();
        expect(fromDateTimeLocal('2026-12-01T09:30')).toBe(expected);
        expect(fromDateTimeLocal('2026-12-01T09:30')).toMatch(/Z$/);
    })

    it('round-trips with toDateTimeLocal', () => {
        const iso = new Date(2026, 2, 8, 14, 45).toISOString();
        expect(fromDateTimeLocal(toDateTimeLocal(iso))).toBe(iso);
    })
})