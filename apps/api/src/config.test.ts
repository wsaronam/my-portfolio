import { describe, expect, it } from 'vitest';
import { loadConfig } from './config.js';




const DATABASE_URL = 'postgres://user:pass@127.0.0.1:5432/portfolio';


describe('loadConfig', () => {
    it('fills in safe defaults', () => {
        const config = loadConfig({ DATABASE_URL });
        expect(config).toMatchObject({
            NODE_ENV: 'development',
            HOST: '127.0.0.1',
            PORT: 3000,
            APP_ORIGIN: 'http://localhost:5173',
        });
    })

    it('turns PORT from text into a number', () => {
        expect(loadConfig({ DATABASE_URL, PORT: '8080' }).PORT).toBe(8080);
    })

    it('fails fast when DATABASE_URL is missing', () => {
        expect(() => loadConfig({})).toThrow(/DATABASE_URL/);
    })

    it.each([
        ['DATABASE_URL', 'mysql://user:pass@localhost/db'],
        ['PORT', '70000'],
        ['NODE_ENV', 'prod'],
        ['APP_ORIGIN', 'not a url'],
    ])('rejects an invalid %s', (name, value) => {
        expect(() => loadConfig({ DATABASE_URL, [name]: value })).toThrow(new RegExp(name));
    })
})