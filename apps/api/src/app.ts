import Fastify, { type FastifyInstance } from "fastify";
import type { Config } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { createDatabase } from "./db/client.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "./http/errorHandler.js";
import { postsRoutes } from "./features/posts/posts.routes.js";
import { createOriginCheck } from "./http/originCheck.js";
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from "./features/auth/auth.routes.js";




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


    // zod schemas are used to validate requests and shape responses
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    const { db, pool } = createDatabase(config.DATABASE_URL);


    // prevents idle connections from crashing the whole server
    pool.on('error', (error) => {
        app.log.error(error, 'Unexpected database pool error');
    })

    app.decorate('config', config);
    app.decorate('db', db);
    app.addHook('onClose', async () => {
        await pool.end();
    })

    // security: reject data-changing requests that don't come from our website
    app.addHook('onRequest', createOriginCheck(config.APP_ORIGIN));

    app.register(cookie);
    // rate limits are opt-in per route (see the login route)
    app.register(rateLimit, { global: false });

    app.register(healthRoutes);
    app.register(postsRoutes, { prefix: 'api/posts' })
    app.register(authRoutes, { prefix: '/api/auth' });

    return app;
}


