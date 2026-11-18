
const UNIQUE_VIOLATION = '23505';

/** true if `value` is an object with a `code` property (like database errors) */
function hasCode(value: unknown): value is { code: unknown } {
    return typeof value === 'object' && value !== null && 'code' in value;
}


/**
 * True if a database error means "this value must be unique and already exists".
 * 23505 is PostgreSQL's code for a unique constraint violation. Drizzle wraps
 * the driver's error, so the code can be on the error itself or on its cause.
 */
export function isUniqueViolation(error: unknown): boolean {
    if (hasCode(error)) {
        return error.code === UNIQUE_VIOLATION;
    }
    return error instanceof Error && hasCode(error.cause) && error.cause.code === UNIQUE_VIOLATION;
}