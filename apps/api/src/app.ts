import Fastify, { type FastifyInstance } from "fastify";
import type { Config } from "./routes/config.js";
import { healthRoutes } from "./routes/health.js";




export function buildApp(config: Config): FastifyInstance {
    const app = Fastify({
        logger: {
            level: config.LOG_LEVEL,
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            ...(config.NODE_ENV === 'development' && {
                transport: { target: 'pino-pretty' },
            }),
        },
    })

    app.register(healthRoutes);
    return app;
}