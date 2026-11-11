import { describe, expect, it } from 'vitest'
import { getPostStatus } from './postStatus'




// a fixed "now" makes the tests give the same result on any day they run
const NOW = new Date('2026-06-15T12:00:00.000Z')


describe('getPostStatus', () => {
    it('treats a post with no publish date as a draft', () => {
        expect(getPostStatus(null, NOW)).toBe('draft');
    })

    it('treats a date in the past as published', () => {
        expect(getPostStatus('2026-06-01T09:00:00.000Z', NOW)).toBe('published');
    })

    it('treats a date in the future as scheduled', () => {
        expect(getPostStatus('2026-07-01T09:00:00.000Z', NOW)).toBe('scheduled');
    })

    it('treats exactly now as published (the boundary case)', () => {
        expect(getPostStatus(NOW.toISOString(), NOW)).toBe('published');
    })
})