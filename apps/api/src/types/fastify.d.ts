import type { Database } from "../db/client.ts";
import type { Config } from "../config.js";




declare module 'fastify' {
    interface FastifyInstance {
        config: Config
        db: Database
    }

    interface FastifyRequest {
        /** set by requireAuth once the session cookie has been verified. */
        user?: { id: string; email: string }
    }
}