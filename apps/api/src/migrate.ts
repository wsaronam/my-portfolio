import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { loadConfig } from './config.js';
import { createDatabase } from './db/client.js';




/**
 * applies any database migrations that haven't run yet, then exits.
 * runs before the server starts on every deploy, using only production
 * dependencies (drizzle-kit is a dev tool and isn't installed there).
 */
const config = loadConfig();
const { db, pool } = createDatabase(config.DATABASE_URL);

// the SQL files live in apps/api/drizzle, next to the compiled dist/ folder
const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));

try {
    await migrate(db, { migrationsFolder });
    console.log('Database migrations are up to date.');
} 
finally {
    await pool.end();
}