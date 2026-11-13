import { createHash } from 'node:crypto';
import { sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { sessions } from '../src/db/schema.js';
import { ADMIN_EMAIL, APP_ORIGIN, buildTestApp, createAdmin, login, loginAsAdmin, resetDatabase } from './helpers.js';




let app: FastifyInstance;


// a fresh app (and a fresh rate-limit counter) plus an empty database for every test
beforeEach(async () => {
    app = await buildTestApp();
    await resetDatabase(app.db);
    await createAdmin(app.db);
})

afterEach(async () => {
    await app.close();
})

function me(cookie?: string) {
    return app.inject({ method: 'GET', url: '/api/auth/me', headers: cookie ? { cookie } : {} });
}


describe('POST /api/auth/login', () => {
    it('logs in with the right password and sets a secure session cookie', async () => {
        const response = await login(app);

        expect(response.statusCode).toBe(204);
        expect(response.headers['cache-control']).toBe('no-store');

        const cookie = response.cookies[0];
        expect(cookie).toMatchObject({ name: 'session', httpOnly: true, sameSite: 'Strict', path: '/' });
        expect(cookie?.value).toMatch(/^[\w-]{43}$/); // 32 random bytes, base64url-encoded
    })

    it('stores only a hash of the session token in the database', async () => {
        const token = (await login(app)).cookies[0]?.value ?? '';
        const [row] = await app.db.select({ id: sessions.id }).from(sessions);

        expect(row?.id).not.toBe(token);
        expect(row?.id).toBe(createHash('sha256').update(token).digest('hex'));
    })

    it('gives the same answer for a wrong password and an unknown email', async () => {
        const wrongPassword = await login(app, ADMIN_EMAIL, 'wrong password');
        const unknownEmail = await login(app, 'nobody@example.com', 'wrong password');

        expect(wrongPassword.statusCode).toBe(401);
        expect(unknownEmail.statusCode).toBe(401);
        expect(wrongPassword.json()).toEqual(unknownEmail.json());
        expect(wrongPassword.cookies).toHaveLength(0);
    })

    it('treats the email case-insensitively', async () => {
        expect((await login(app, 'ADMIN@Example.com')).statusCode).toBe(204);
    })

    it('blocks the 6th attempt within 15 minutes', async () => {
        for (let attempt = 1; attempt <= 5; attempt++) {
            expect((await login(app, ADMIN_EMAIL, 'guess')).statusCode).toBe(401);
        }
        // even the correct password is refused now: the limit is per IP, not per guess
        expect((await login(app)).statusCode).toBe(429);
    })

    it('rejects a login posted from another website (CSRF)', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/auth/login',
            headers: { origin: 'https://evil.example' },
            payload: { email: ADMIN_EMAIL, password: 'anything' },
        });
        expect(response.statusCode).toBe(403);
    })
})


describe('sessions', () => {
    it('GET /me returns the admin when logged in, 401 otherwise', async () => {
        const cookie = await loginAsAdmin(app);

        expect((await me(cookie)).json()).toEqual({ email: ADMIN_EMAIL });
        expect((await me()).statusCode).toBe(401);
        expect((await me('session=made-up-token')).statusCode).toBe(401);
    })

    it('logout deletes the session, so the old cookie stops working', async () => {
        const cookie = await loginAsAdmin(app);

        const response = await app.inject({
            method: 'POST',
            url: '/api/auth/logout',
            headers: { origin: APP_ORIGIN, cookie },
        });

        expect(response.statusCode).toBe(204);
        expect((await me(cookie)).statusCode).toBe(401);
    })

    it('an expired session no longer works', async () => {
        const cookie = await loginAsAdmin(app);
        await app.db.update(sessions).set({ expiresAt: sql`now() - interval '1 minute'` });

        expect((await me(cookie)).statusCode).toBe(401);
    })
})