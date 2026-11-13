import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { getTestDatabaseUrl } from './testDatabase.js';




/** runs once before all integration tests: make sure the test database exists and is migrated */
export default async function setup() {
    const testUrl = getTestDatabaseUrl();
    const databaseName = new URL(testUrl).pathname.slice(1);

    // 1. connect to the built-in "postgres" database and create the test database if needed
    const adminUrl = new URL(testUrl);
    adminUrl.pathname = '/postgres';
    const admin = new pg.Client({ connectionString: adminUrl.toString() });
    await admin.connect();

    try {
        const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName]);
        if (rowCount === 0) {
            // CREATE DATABASE can't take a $1 parameter. hat's safe here only because
            // getTestDatabaseUrl() already checked the name matches /^[a-z0-9_]+_test$/
            await admin.query(`CREATE DATABASE "${databaseName}"`);
        }
    } 
    finally {
        await admin.end();
    }

    // 2. apply the same migration files that production uses
    const pool = new pg.Pool({ connectionString: testUrl, max: 1 });
    try {
        await migrate(drizzle({ client: pool }), { migrationsFolder: './drizzle' });
    } 
    finally {
        await pool.end();
    }
}