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
import { adminPostsRoutes } from "./features/admin-posts/adminPosts.routes.js";
import helmet from '@fastify/helmet'




export function buildApp(config: Config): FastifyInstance {
    const app = Fastify({
        logger: {
            level: config.LOG_LEVEL,
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            ...(config.NODE_ENV === 'development' && {
                transport: { target: 'pino-pretty' },
            }),
        },
        // only believe X-Forwarded-For when the request really comes from one of our
        // proxies. never use `true`: then any visitor could claim to be any IP
        trustProxy: config.TRUST_PROXY.length > 0 ? config.TRUST_PROXY : false,
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


    // security headers on every response
    app.register(helmet, {
        // this server only sends JSON, never web pages, so it needs no scripts,
        // styles, images or frames at all: block everything
        contentSecurityPolicy: {
            useDefaults: false,
            directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
        },
        // HSTS tells browsers "only ever use HTTPS for this site". production only:
        // localhost has no HTTPS
        strictTransportSecurity:
            config.NODE_ENV === 'production' ? { maxAge: 31_536_000, includeSubDomains: true } : false,
    })

    // security: reject data-changing requests that don't come from our website.
    // hooks run in the order they're added, so this goes after helmet: even these
    // 403 responses then carry the security headers
    app.addHook('onRequest', createOriginCheck(config.APP_ORIGIN));


    app.register(cookie);
    // rate limits are opt-in per route (see the login route)
    app.register(rateLimit, { global: false });

    app.register(healthRoutes);
    app.register(postsRoutes, { prefix: 'api/posts' });
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(adminPostsRoutes, { prefix: '/api/admin/posts' });

    return app;
}


