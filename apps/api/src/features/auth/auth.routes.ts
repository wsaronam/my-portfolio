import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getSessionCookie } from "./sessionCookie.js";
import { loginBodySchema, meResponseSchema } from "./auth.schemas.js";
import { errorResponseSchema } from "../../http/schemas.js";
import { users } from '../../db/schema.js';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { verifyPassword, verifyAgainstDummy } from "./password.js";
import { deleteExpiredSessions, createSession, deleteSession } from "./sessions.js";
import { requireAuth } from "./requireAuth.js";




const INVALID_LOGIN = {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Invalid email or password.'
}


export const authRoutes: FastifyPluginAsyncZod = async (app) => {
    const cookie = getSessionCookie(app.config);

    // responses about who is logged in must never be stored by browsers or CDNs
    app.addHook('onSend', async (_request, reply) => {
        reply.header('cache-control', 'no-store');
    });

    app.post(
        '/login',
        {
            config: {
                // at most 5 attempts per 15 minutes from one IP address
                rateLimit: { max: 5, timeWindow: '15 minutes' },
            },
            schema: {
                body: loginBodySchema,
                response: { 204: z.null(), 401: errorResponseSchema },
            },
        },

        async (request, reply) => {
            const { email, password } = request.body;

            const rows = await app.db
                .select({ id: users.id, passwordHash: users.passwordHash })
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
            const user = rows[0];

            const passwordIsValid = user
                ? await verifyPassword(user.passwordHash, password)
                : await verifyAgainstDummy(password);

            if (!user || !passwordIsValid) {
                request.log.warn({ email }, 'Failed login attempt');
                return reply.code(401).send(INVALID_LOGIN);
            }

            await deleteExpiredSessions(app.db, user.id);
            const session = await createSession(app.db, user.id);

            request.log.info({ userId: user.id }, 'Admin logged in');
            reply.setCookie(cookie.name, session.token, { ...cookie.options, expires: session.expiresAt });
            return reply.code(204).send(null);
        }
    );


    app.post('/logout', { schema: { response: { 204: z.null() } } }, async (request, reply) => {
        const token = request.cookies[cookie.name];

        if (token) {
            await deleteSession(app.db, token);
        }

        reply.clearCookie(cookie.name, cookie.options);
        return reply.code(204).send(null);
    });


    app.get(
        '/me',
        {
            preHandler: requireAuth,
            schema: { response: { 200: meResponseSchema, 401: errorResponseSchema } },
        },
        async (request) => {
            // requireAuth guarantees request.user exists here
            return { email: request.user!.email };
        }
    );
}