import { describe, expect, it } from 'vitest';
import { hashPassword, verifyAgainstDummy, verifyPassword } from './password.js';




describe('password hashing', () => {
    it('stores an Argon2id hash, never the password itself', async () => {
        const hash = await hashPassword('correct horse battery staple');
        expect(hash).toMatch(/^\$argon2id\$/);
        expect(hash).not.toContain('correct horse');
    })

    it('accepts the right password and rejects a wrong one', async () => {
        const hash = await hashPassword('correct horse battery staple');
        await expect(verifyPassword(hash, 'correct horse battery staple')).resolves.toBe(true);
        await expect(verifyPassword(hash, 'Correct horse battery staple')).resolves.toBe(false);
    })

    it('salts every hash, so the same password never gives the same hash twice', async () => {
        const [first, second] = await Promise.all([hashPassword('same password'), hashPassword('same password')]);
        expect(first).not.toBe(second);
    })

    it('always says no for unknown users', async () => {
        await expect(verifyAgainstDummy('dummy-password-for-timing-only')).resolves.toBe(false);
    })
})