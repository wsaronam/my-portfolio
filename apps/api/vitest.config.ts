import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';




// load apps/api/.env (for TEST_DATABASE_URL), the same way drizzle.config.ts does
if (existsSync('.env')) {
    process.loadEnvFile('.env');
}


export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'integration',
                    include: ['test/**/*.test.ts'],
                    // creates and migrates the test database once, before any test file runs
                    globalSetup: ['test/globalSetup.ts'],
                    // all files share one database, so run them one at a time
                    fileParallelism: false,
                },
            },
        ],
    },
})