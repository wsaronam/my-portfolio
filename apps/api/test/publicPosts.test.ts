import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { posts } from '../src/db/schema.js';
import { buildTestApp, resetDatabase } from './helpers.js';




let app: FastifyInstance;

const DAY = 24 * 60 * 60 * 1000;

const post = (slug: string, publishedAt: Date | null) => ({
  slug,
  title: `Title of ${slug}`,
  summary: 'Summary',
  body: '# Body',
  publishedAt,
});



// these tests only read, so one app and one set of posts is enough for the whole file
beforeAll(async () => {
    app = await buildTestApp();
    await resetDatabase(app.db);
    await app.db.insert(posts).values([
        post('older-post', new Date(Date.now() - 10 * DAY)),
        post('newer-post', new Date(Date.now() - 1 * DAY)),
        post('secret-draft', null),
        post('future-post', new Date(Date.now() + 7 * DAY)),
    ]);
});

afterAll(async () => {
    await app.close();
});


describe('GET /api/posts', () => {
    it('lists only published posts, newest first', async () => {
        const response = await app.inject({ method: 'GET', url: '/api/posts' });
        const body = response.json();

        expect(response.statusCode).toBe(200)
        expect(body.items.map((item: { slug: string }) => item.slug)).toEqual(['newer-post', 'older-post']);
        expect(body.total).toBe(2);
    });

    it('never includes internal fields', async () => {
        const [item] = (await app.inject({ method: 'GET', url: '/api/posts' })).json().items;
        expect(Object.keys(item).sort()).toEqual(['publishedAt', 'slug', 'summary', 'tags', 'title']);
    });

    it('can be cached briefly by browsers and CDNs', async () => {
        const response = await app.inject({ method: 'GET', url: '/api/posts' });
        expect(response.headers['cache-control']).toBe('public, max-age=60');
    });

    it.each(['0', '1001', 'abc', '-1'])('rejects page=%s', async (page) => {
        const response = await app.inject({ method: 'GET', url: `/api/posts?page=${page}` });
        expect(response.statusCode).toBe(400);
    });
});


describe('GET /api/posts/:slug', () => {
    it('returns a published post with its body', async () => {
        const response = await app.inject({ method: 'GET', url: '/api/posts/newer-post' });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({ slug: 'newer-post', body: '# Body' });
    });

    it.each(['secret-draft', 'future-post', 'does-not-exist'])('hides %s behind a 404', async (slug) => {
        const response = await app.inject({ method: 'GET', url: `/api/posts/${slug}` });
        expect(response.statusCode).toBe(404);
    });

    it('rejects a malformed slug before touching the database', async () => {
        const response = await app.inject({ method: 'GET', url: `/api/posts/${encodeURIComponent("x' OR '1'='1")}` });
        expect(response.statusCode).toBe(400);
    });
});