import type { Database } from "../db/client.ts";




declare module 'fastify' {
    interface FastifyInstance {
        db: Database;
    }
}