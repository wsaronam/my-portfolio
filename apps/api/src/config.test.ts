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
            TRUST_PROXY: [],
        });
    })

    it('turns PORT from text into a number', () => {
        expect(loadConfig({ DATABASE_URL, PORT: '8080' }).PORT).toBe(8080);
    })

    it('reads TRUST_PROXY as a list of addresses', () => {
        expect(loadConfig({ DATABASE_URL, TRUST_PROXY: ' 10.0.0.0/8, loopback ' }).TRUST_PROXY).toEqual([
            '10.0.0.0/8',
            'loopback',
        ]);
    })

    it('treats an empty CLIENT_IP_HEADER as not set (a blank line in .env)', () => {
        expect(loadConfig({ DATABASE_URL, CLIENT_IP_HEADER: '' }).CLIENT_IP_HEADER).toBeUndefined();
    })

    it('requires a verified TLS connection to the database in production', () => {
        expect(() => loadConfig({ DATABASE_URL, NODE_ENV: 'production' })).toThrow(/sslmode=verify-full/);
        expect(() => loadConfig({ DATABASE_URL: `${DATABASE_URL}?sslmode=require`, NODE_ENV: 'production' })).toThrow(
            /sslmode=verify-full/,
        );
        expect(loadConfig({ DATABASE_URL: `${DATABASE_URL}?sslmode=verify-full`, NODE_ENV: 'production' }).NODE_ENV).toBe(
            'production',
        );
    })

    it('fails fast when DATABASE_URL is missing', () => {
        expect(() => loadConfig({})).toThrow(/DATABASE_URL/);
    })

    it.each([
        ['DATABASE_URL', 'mysql://user:pass@localhost/db'],
        ['PORT', '70000'],
        ['NODE_ENV', 'prod'],
        ['APP_ORIGIN', 'not a url'],
        ['TRUST_PROXY', 'true'],
        ['TRUST_PROXY', '999.1.1.1'],
        ['CLIENT_IP_HEADER', 'CF-Connecting-IP'],
        ['CLIENT_IP_HEADER', 'x-ip; evil'],
    ])('rejects an invalid %s', (name, value) => {
        expect(() => loadConfig({ DATABASE_URL, [name]: value })).toThrow(new RegExp(name));
    })
})