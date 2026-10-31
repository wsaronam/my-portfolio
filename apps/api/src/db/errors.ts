/**
 * True if a database error means "this value must be unique and already exists".
 * 23505 is PostgreSQL's code for a unique constraint violation. Drizzle wraps
 * the driver's error, so the code can be on the error itself or on its cause.
 */
export function isUniqueViolation(error: unknown): boolean {
    const code = (error as { code?: unknown })?.code ?? (error as { cause?: { code?: unknown } })?.cause?.code;
    return code === '23505';
}