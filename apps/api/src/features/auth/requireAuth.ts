import { getSessionCookie } from "./sessionCookie.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import { findUserBySessionToken } from "./sessions.js";




/**
 * Add to any route that only a logged-in admin may use:
 *   app.post('/...', { preHandler: requireAuth }, handler)
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    const { name } = getSessionCookie(request.server.config)
    const token = request.cookies[name]

    const user = token ? await findUserBySessionToken(request.server.db, token) : null

    if (!user) {
        return reply.code(401).send({
            statusCode: 401,
            error: 'Unauthorized',
            message: 'You must be logged in.',
        })
    }

    request.user = user
}