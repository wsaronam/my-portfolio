import { describe, expect, it } from 'vitest';
import { isUniqueViolation } from './errors.js';




describe('isUniqueViolation', () => {
    it('spots the PostgreSQL code on the error itself', () => {
        expect(isUniqueViolation({ code: '23505' })).toBe(true);
    })

    it('spots it when Drizzle wraps the driver error', () => {
        expect(isUniqueViolation(new Error('Failed query', { cause: { code: '23505' } }))).toBe(true);
    })

    it.each([
        ['another database error', { code: '23503' }],
        ['a plain Error', new Error('boom')],
        ['null', null],
        ['a string', 'oops'],
    ])('ignores %s', (_label, error) => {
        expect(isUniqueViolation(error)).toBe(false);
    })
})