import Fastify from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createOriginCheck } from './originCheck.js';




// a tiny Fastify app with only the origin check, so we test it on its own
const app = Fastify({ logger: false });
app.addHook('onRequest', createOriginCheck('http://localhost:5173'));
app.get('/thing', async () => ({ ok: true }));
app.post('/thing', async () => ({ ok: true }));

beforeAll(() => app.ready());
afterAll(() => app.close());

describe('origin check (CSRF protection)', () => {
    it('lets reads through from anywhere', async () => {
        const response = await app.inject({ method: 'GET', url: '/thing', headers: { origin: 'https://evil.example' } });
        expect(response.statusCode).toBe(200);
    })

    it('allows changes from our own website', async () => {
        const response = await app.inject({ method: 'POST', url: '/thing', headers: { origin: 'http://localhost:5173' } });
        expect(response.statusCode).toBe(200);
    })

    it.each([
        ['another website', 'https://evil.example'],
        ['a look-alike port', 'http://localhost:5174'],
        ['https instead of http', 'https://localhost:5173'],
        ['a look-alike subdomain', 'http://localhost:5173.evil.example'],
    ])('blocks changes from %s', async (_label, origin) => {
        const response = await app.inject({ method: 'POST', url: '/thing', headers: { origin } });
        expect(response.statusCode).toBe(403);
        expect(response.json()).toMatchObject({ message: 'Request origin not allowed.' });
    })

    it('blocks changes with no Origin header at all', async () => {
        const response = await app.inject({ method: 'POST', url: '/thing' });
        expect(response.statusCode).toBe(403);
    })
})