import { z } from 'zod';




const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().min(1).default('127.0.0.1'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    APP_ORIGIN: z.url().default('http://localhost:5173'), //website's address.  only requests from this origin may change data
})


export type Config = z.infer<typeof envSchema>


/** reads and validates the environmental variables.
 *  throws error if any are missing or invalid.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
    const result = envSchema.safeParse(env);

    if (!result.success) {
        throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
    }

    return result.data;
}