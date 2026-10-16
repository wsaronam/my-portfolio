import pg from 'pg';
import { loadConfig } from '../src/config.js';




const HINTS: Record<string, string> = {
    ECONNREFUSED: 'Nothing is listening at that host/port. Is the database running? Try: npm run db:up',
    ETIMEDOUT: 'The connection timed out. Is the database running, and is the host/port correct?',
    ENOTFOUND: 'The host name in DATABASE_URL could not be found. Check for typos.',
    '28P01': 'Wrong password. DATABASE_URL must use the same password as POSTGRES_PASSWORD in the root .env.',
    '28000': 'That user does not exist. Check the user name in DATABASE_URL.',
    '3D000': 'That database does not exist. Check the database name at the end of DATABASE_URL.',
}


const config = loadConfig();
const url = new URL(config.DATABASE_URL);
console.log(`Connecting to ${url.hostname}:${url.port} as "${url.username}", database "${url.pathname.slice(1)}"...`);

const client = new pg.Client({ connectionString: config.DATABASE_URL, connectionTimeoutMillis: 5_000 })

try {
    await client.connect();
    const result = await client.query<{ version: string }>('select version()');
    console.log('Connected.', result.rows[0]?.version);
}
catch (err) {
    const code = (err as { code?: string }).code ?? 'UNKNOWN';
    console.error(`Connection failed (${code}): ${(err as Error).message}`);
    console.error(`  Hint: ${HINTS[code] ?? 'See the error message above.'}`);
    process.exitCode = 1;
}
finally {
    await client.end().catch(() => {});
}