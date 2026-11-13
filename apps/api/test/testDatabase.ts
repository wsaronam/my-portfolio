/**
 * returns TEST_DATABASE_URL, after checking it can't possibly point at real data.
 * integration tests DELETE EVERYTHING in this database before each test.
 */
export function getTestDatabaseUrl(): string {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) {
        throw new Error(
            'TEST_DATABASE_URL is not set. Add it to apps/api/.env (see .env.example), e.g.\n' +
                'TEST_DATABASE_URL=postgres://USER:PASSWORD@127.0.0.1:5432/portfolio_test',
        );
    } 

    const url = new URL(value);
    const databaseName = url.pathname.slice(1);

    // safety guard: refuse to run against anything that isn't clearly a test database.
    if (!/^[a-z0-9_]+_test$/.test(databaseName)) {
        throw new Error(`Refusing to run tests against "${databaseName}": the database name must end with "_test".`);
    }
    if (value === process.env.DATABASE_URL) {
        throw new Error('TEST_DATABASE_URL must not be the same as DATABASE_URL.');
    }

    return value;
}