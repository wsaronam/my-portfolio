import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it } from 'vitest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_ORIGIN, buildTestApp, createAdmin, login, resetDatabase } from './helpers.js';




let app: FastifyInstance | undefined;


afterEach(async () => {
  await app?.close();
  app = undefined;
})


describe('security headers', () => {
    // every kind of response must carry them: success, not found, and errors
    it.each([
        ['a normal response', 'GET', '/api/posts', {}],
        ['a 404', 'GET', '/api/nothing-here', {}],
        ['a 403 from the origin check', 'POST', '/api/auth/login', { origin: 'https://evil.example' }],
    ] as const)('are on %s', async (_label, method, url, headers) => {
        app = await buildTestApp();
        const response = await app.inject({ method, url, headers });

        expect(response.headers).toMatchObject({
            'content-security-policy': "default-src 'none';frame-ancestors 'none'",
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'SAMEORIGIN',
            'referrer-policy': 'no-referrer',
            'cross-origin-resource-policy': 'same-origin',
        });
    });

    it('only sends HSTS in production', async () => {
        app = await buildTestApp();
        expect((await app.inject({ method: 'GET', url: '/api/posts' })).headers).not.toHaveProperty(
            'strict-transport-security',
        );
        await app.close();

        app = await buildTestApp({ NODE_ENV: 'production' });
        expect((await app.inject({ method: 'GET', url: '/api/posts' })).headers['strict-transport-security']).toBe(
            'max-age=31536000; includeSubDomains',
        );
    });

    it('does not allow other websites to read responses (no CORS headers)', async () => {
        app = await buildTestApp();
        const response = await app.inject({ method: 'GET', url: '/api/posts', headers: { origin: 'https://evil.example' } });
        expect(response.headers).not.toHaveProperty('access-control-allow-origin');
    });
});


describe('trustProxy and the login rate limit', () => {
    /**
     * five wrong guesses, each with an X-Forwarded-For claiming a different IP.
     * inject() requests arrive from 127.0.0.1 unless remoteAddress says otherwise
     */
    async function guessWithFakeIps(target: FastifyInstance, remoteAddress = '127.0.0.1') {
        await resetDatabase(target.db);
        await createAdmin(target.db);
        for (let i = 1; i <= 5; i++) {
            await target.inject({
                method: 'POST',
                url: '/api/auth/login',
                remoteAddress,
                headers: { origin: APP_ORIGIN, 'x-forwarded-for': `203.0.113.${i}` },
                payload: { email: ADMIN_EMAIL, password: 'guess' },
            });
        }
    }

    it('with no proxy configured, a faked X-Forwarded-For cannot dodge the limit', async () => {
        app = await buildTestApp();
        await guessWithFakeIps(app);
        expect((await login(app)).statusCode).toBe(429);
    });

    it('a header from a machine that is not our proxy is ignored', async () => {
        // we trust 10.x.x.x, but these requests come straight from 127.0.0.1
        app = await buildTestApp({ TRUST_PROXY: '10.0.0.0/8' });
        await guessWithFakeIps(app);
        expect((await login(app)).statusCode).toBe(429);
    });

    it('behind our proxy, each real visitor IP gets its own limit', async () => {
        // the requests come from a trusted proxy (10.0.0.5), so the forwarded IPs are
        // believed: 5 different visitors each used 1 of their own 5 attempts
        app = await buildTestApp({ TRUST_PROXY: '10.0.0.0/8' });
        await guessWithFakeIps(app, '10.0.0.5');

        // a 6th visitor, also arriving through the proxy
        const response = await app.inject({
            method: 'POST',
            url: '/api/auth/login',
            remoteAddress: '10.0.0.5',
            headers: { origin: APP_ORIGIN, 'x-forwarded-for': '203.0.113.99' },
            payload: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
        });
        expect(response.statusCode).toBe(204);
    });
})