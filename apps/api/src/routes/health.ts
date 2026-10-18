import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { sql } from 'drizzle-orm';
import { z } from 'zod';




const healthResponseSchema = z.object({
    status: z.enum(['ok', 'degraded']),
    database: z.enum(['ok', 'unavailable']),
    uptimeSeconds: z.number()
});


export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
    app.get(
        '/health',
        { schema: { response: { 200: healthResponseSchema, 503: healthResponseSchema } } },
        async (request, reply) => {
            const uptimeSeconds = Math.round(process.uptime());

            try {
                await app.db.execute(sql`select 1`);
                return { status: 'ok', database: 'ok', uptimeSeconds } as const;
            } 
            catch (err) {
                request.log.error(err, 'Database health check failed');
                return reply.code(503).send({ status: 'degraded', database: 'unavailable', uptimeSeconds });
            }
        },
    )
}