import { z } from 'zod';




const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().min(1).default('127.0.0.1'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    // website's address.  only requests from this origin may change data
    APP_ORIGIN: z.url().default('http://localhost:5173'), 
    // the proxies (load balancers) in front of this server, as a comma-separated
    // list of IPs, IP ranges (CIDR) or 'loopback' / 'linklocal' / 'uniquelocal'.
    // empty = no proxy: ignore X-Forwarded-For, because any visitor could fake it
    TRUST_PROXY: z
        .string()
        .default('')
        .transform((value) => value.split(',').map((entry) => entry.trim()).filter(Boolean))
        .pipe(
            z
                .array(
                    z.union([
                        z.ipv4(),
                        z.ipv6(),
                        z.cidrv4(),
                        z.cidrv6(),
                        z.enum(['loopback', 'linklocal', 'uniquelocal']),
                    ]),
                )
                .max(20),
        ),
    // a header that a trusted edge proxy sets to the visitor's IP and that visitors
    // can't fake. on Render this is Cloudflare's 'cf-connecting-ip'. unset = use the
    // connection's own address (correct when nothing sits in front of the server)
    CLIENT_IP_HEADER: z
        .string()
        .regex(/^[a-z0-9-]*$/, 'Use a lowercase header name, e.g. cf-connecting-ip')
        .optional()
        .transform((value) => value || undefined),
})
    .superRefine((env, ctx) => {
        // in production the database is on the internet: insist on encrypted connections
        // that check the server's certificate (so nobody can pretend to be the database)
        if (env.NODE_ENV === 'production' && new URL(env.DATABASE_URL).searchParams.get('sslmode') !== 'verify-full') {
            ctx.addIssue({
                code: 'custom',
                path: ['DATABASE_URL'],
                message: 'In production, DATABASE_URL must end with ?sslmode=verify-full',
            });
        }
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