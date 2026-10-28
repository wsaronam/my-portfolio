import type { FastifyRequest, FastifyReply } from "fastify";




const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);


/**
 * CSRF protection: browsers attach an Origin header to every request that
 * changes data. only our own website may change data, so any other origin,
 * or no origin at all, is rejected before the request reaches a route
 */
export function createOriginCheck(allowedOrigin: string) {
    const expected = new URL(allowedOrigin).origin;

    return async function originCheck(request: FastifyRequest, reply: FastifyReply) {
        if (SAFE_METHODS.has(request.method)) {
            return;
        }

        if (request.headers.origin !== expected) {
            request.log.warn({ origin: request.headers.origin }, 'Blocked request from untrusted origin');
            return reply.code(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Request origin not allowed.',
            });
        }
    }
}