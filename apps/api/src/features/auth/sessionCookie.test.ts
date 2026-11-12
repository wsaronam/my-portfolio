import { describe, expect, it } from 'vitest';
import { loadConfig } from '../../config.js';
import { getSessionCookie } from './sessionCookie.js';




const DATABASE_URL = 'postgres://user:pass@127.0.0.1:5432/portfolio';


describe('getSessionCookie', () => {
    it('is HttpOnly and SameSite=Strict in every environment', () => {
        for (const NODE_ENV of ['development', 'test', 'production']) {
            const { options } = getSessionCookie(loadConfig({ DATABASE_URL, NODE_ENV }));
            expect(options).toMatchObject({ httpOnly: true, sameSite: 'strict', path: '/' });
        }
    })

    it('uses the Secure, __Host- prefixed cookie in production', () => {
        const cookie = getSessionCookie(loadConfig({ DATABASE_URL, NODE_ENV: 'production' }));
        expect(cookie.name).toBe('__Host-session');
        expect(cookie.options.secure).toBe(true);
    })

    it('uses a plain cookie in development, where there is no HTTPS', () => {
        const cookie = getSessionCookie(loadConfig({ DATABASE_URL, NODE_ENV: 'development' }));
        expect(cookie.name).toBe('session');
        expect(cookie.options.secure).toBe(false);
    })
})