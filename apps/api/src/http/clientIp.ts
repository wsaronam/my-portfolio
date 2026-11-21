import type { FastifyRequest } from 'fastify';




/**
 * the visitor's IP address. if `trustedHeader` is set (e.g. 'cf-connecting-ip'),
 * it's read from that header, which our edge proxy sets and visitors can't fake.
 * only configure a header that the proxy in front of you really controls.
 */
    export function clientIp(request: FastifyRequest, trustedHeader: string | undefined): string {
    if (trustedHeader) {
        const value = request.headers[trustedHeader];
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }
    }
    return request.ip;
}