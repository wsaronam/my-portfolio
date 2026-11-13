import { sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import type { Database } from '../src/db/client.js';
import { users } from '../src/db/schema.js';
import { hashPassword } from '../src/features/auth/password.js';
import { getTestDatabaseUrl } from './testDatabase.js';




export const APP_ORIGIN = 'http://localhost:5173';
export const ADMIN_EMAIL = 'admin@example.com';
export const ADMIN_PASSWORD = 'correct horse battery staple';


/** the real app, configured for tests: test database, no log noise */
export async function buildTestApp(): Promise<FastifyInstance> {
    const config = loadConfig({
        NODE_ENV: 'test',
        LOG_LEVEL: 'silent',
        DATABASE_URL: getTestDatabaseUrl(),
        APP_ORIGIN,
    });

    const app = buildApp(config);
    await app.ready();
    return app;
}

/** empties every table, so each test starts from a blank database */
export async function resetDatabase(db: Database) {
    await db.execute(sql`TRUNCATE TABLE sessions, users, posts RESTART IDENTITY CASCADE`);
}

export async function createAdmin(db: Database) {
    await db.insert(users).values({ email: ADMIN_EMAIL, passwordHash: await hashPassword(ADMIN_PASSWORD) });
}


/** sends a login request the way our website would (with its Origin header) */
export function login(app: FastifyInstance, email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
    return app.inject({
        method: 'POST',
        url: '/api/auth/login',
        headers: { origin: APP_ORIGIN },
        payload: { email, password },
    });
}


/** logs in and returns the Cookie header to send with later requests */
export async function loginAsAdmin(app: FastifyInstance): Promise<string> {
    const response = await login(app);

    if (response.statusCode !== 204) {
        throw new Error(`Login failed in test setup: ${response.statusCode} ${response.body}`);
    }

    const cookie = response.cookies[0];
    if (!cookie) throw new Error('Login did not set a cookie');
    return `${cookie.name}=${cookie.value}`;
}