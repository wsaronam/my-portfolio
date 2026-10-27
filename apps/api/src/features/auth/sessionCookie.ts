import type { Config } from '../../config.js';
import type { CookieSerializeOptions } from '@fastify/cookie';




/**
 * in production the cookie gets the __Host- prefix, which browsers only accept
 * if it is Secure (HTTPS only), has Path=/ and no Domain, so it can't be
 * overwritten by another subdomain. local development uses plain HTTP, so it can't
 * be Secure there.
 */
export function getSessionCookie(config: Config) {
    const isProduction = config.NODE_ENV === 'production';

    const options: CookieSerializeOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
    }

    return { name: isProduction ? '__Host-session' : 'session', options };
}