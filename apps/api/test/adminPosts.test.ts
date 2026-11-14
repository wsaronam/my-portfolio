import type { FastifyInstance, InjectOptions } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APP_ORIGIN, buildTestApp, createAdmin, loginAsAdmin, resetDatabase } from './helpers.js';




let app: FastifyInstance;
let cookie: string;


beforeEach(async () => {
    app = await buildTestApp();
    await resetDatabase(app.db);
    await createAdmin(app.db);
    cookie = await loginAsAdmin(app);
});

afterEach(async () => {
    await app.close();
});


const MISSING_ID = '00000000-0000-4000-8000-000000000000';

const validPost = {
    slug: 'my-first-post',
    title: 'My first post',
    summary: 'A summary',
    body: '# Hello',
    tags: ['testing'],
    publishedAt: null,
};


/** an admin request, sent with the login cookie and our website's Origin */
function admin(options: InjectOptions) {
    return app.inject({ ...options, headers: { origin: APP_ORIGIN, cookie, ...options.headers } });
}

/** creates a post from validPost, with any fields replaced (even invalid ones, to test validation) */
function createPost(overrides: Record<string, unknown> = {}) {
    return admin({ method: 'POST', url: '/api/admin/posts', payload: { ...validPost, ...overrides } });
}



describe('access control', () => {
    // every admin route, called without a session cookie, must be refused
    it.each([
        ['GET', '/api/admin/posts'],
        ['GET', `/api/admin/posts/${MISSING_ID}`],
        ['POST', '/api/admin/posts'],
        ['PUT', `/api/admin/posts/${MISSING_ID}`],
        ['DELETE', `/api/admin/posts/${MISSING_ID}`],
    ] as const)('%s %s needs a login', async (method, url) => {
        const response = await app.inject({ method, url, headers: { origin: APP_ORIGIN }, payload: validPost });
        expect(response.statusCode).toBe(401);
    });

    it('marks admin responses as never cacheable', async () => {
        const response = await admin({ method: 'GET', url: '/api/admin/posts' });
        expect(response.headers['cache-control']).toBe('no-store');
    });
});


describe('creating posts', () => {
    it('creates a draft that the admin can see but the public cannot', async () => {
        const response = await createPost();
        expect(response.statusCode).toBe(201);
        expect(response.json()).toMatchObject({ slug: 'my-first-post', publishedAt: null });

        const list = (await admin({ method: 'GET', url: '/api/admin/posts' })).json();
        expect(list.items).toHaveLength(1);
        expect((await app.inject({ method: 'GET', url: '/api/posts/my-first-post' })).statusCode).toBe(404);
    });

    it('publishes a post with a past date', async () => {
        await createPost({ publishedAt: '2026-01-01T09:00:00.000Z' });
        expect((await app.inject({ method: 'GET', url: '/api/posts/my-first-post' })).statusCode).toBe(200);
    });

    it('refuses a slug that is already taken', async () => {
        await createPost();
        const response = await createPost({ title: 'Another post' });

        expect(response.statusCode).toBe(409);
        expect(response.json().message).toBe('Another post already uses this slug.');
    });

    it.each([
        ['an invalid slug', { slug: 'Not A Slug' }],
        ['an empty title', { title: '   ' }],
        ['a date that is not ISO', { publishedAt: 'next tuesday' }],
        ['too many tags', { tags: Array.from({ length: 11 }, (_, i) => `t${i}`) }],
    ])('rejects %s', async (_label, overrides) => {
        const response = await createPost(overrides);
        expect(response.statusCode).toBe(400);
    });

    it('ignores fields the client must not control (mass assignment)', async () => {
        const response = await admin({
            method: 'POST',
            url: '/api/admin/posts',
            payload: { ...validPost, id: MISSING_ID, createdAt: '2000-01-01T00:00:00.000Z' },
        });
        const created = response.json();

        expect(response.statusCode).toBe(201);
        expect(created.id).not.toBe(MISSING_ID);
        expect(created.createdAt).not.toBe('2000-01-01T00:00:00.000Z');
    });
});


describe('updating and deleting posts', () => {
    it('updates a post', async () => {
        const { id } = (await createPost()).json();
        const response = await admin({
            method: 'PUT',
            url: `/api/admin/posts/${id}`,
            payload: { ...validPost, title: 'A better title' },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().title).toBe('A better title');
    });

    it('returns 404 for a post that does not exist and 400 for a malformed id', async () => {
        const put = (id: string) => admin({ method: 'PUT', url: `/api/admin/posts/${id}`, payload: validPost });
        expect((await put(MISSING_ID)).statusCode).toBe(404);
        expect((await put('not-a-uuid')).statusCode).toBe(400);
    });

    it('deletes a post, and deleting it again is a 404', async () => {
        const { id } = (await createPost()).json();
        const remove = () => admin({ method: 'DELETE', url: `/api/admin/posts/${id}` });

        expect((await remove()).statusCode).toBe(204);
        expect((await remove()).statusCode).toBe(404);
    });
});