import type { FastifyPluginAsync } from 'fastify';
import { sql } from 'drizzle-orm';




const healthResponse = {
    type: 'object',
    properties: {
        status: { type: 'string' },
        database: { type: 'string' },
        uptimeSeconds: { type: 'number' },
    },
    required: ['status', 'database', 'uptimeSeconds'],
}


export const healthRoutes: FastifyPluginAsync = async (app) => {
    app.get(
        '/health',
        { schema: { response: { 200: healthResponse, 503: healthResponse } } },
        async (request, reply) => {
            const uptimeSeconds = Math.round(process.uptime());

            try {
                await app.db.execute(sql`select 1`);
                return { status: 'ok', database: 'ok', uptimeSeconds };
            } 
            catch (err) {
                request.log.error(err, 'Database health check failed');
                return reply.code(503).send({ status: 'degraded', database: 'unavailable', uptimeSeconds });
            }
        },
    )
}