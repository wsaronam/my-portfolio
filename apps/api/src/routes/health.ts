import type { FastifyPluginAsync } from 'fastify';




export const healthRoutes: FastifyPluginAsync = async (app) => {
    app.get(
        '/health',
        {
            schema: {
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            uptimeSeconds: { type: 'number' },
                        },
                        required: ['status', 'uptimeSeconds'],
                    },
                },
            },
        },
        async () => {
            return { status: 'ok', uptimeSeconds: Math.round(process.uptime()) };
        }
    )
}