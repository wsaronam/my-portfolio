import { z } from 'zod';




// Error response from API
export class ApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}


const errorBodySchema = z.object({ message: z.string() });


type RequestOptions<T> = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: unknown
    schema?: z.ZodType<T>
    signal?: AbortSignal
};


export async function apiRequest<T = undefined>(
    path: string, { method = 'GET', body, schema, signal }: RequestOptions<T> = {}
): Promise<T> {
    const response = await fetch(`/api${path}`, {
        method,
        headers: {
            Accept: 'application/json',
            ...(body !== undefined && { 'Content-Type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
    })

    if (!response.ok) {
        const parsed = errorBodySchema.safeParse(await response.json().catch(() => null));
        const message = parsed.success ? parsed.data.message : `Request failed (${response.status})`;
        throw new ApiError(response.status, message);
    }

    if (!schema) {
        return undefined as T;
    }

    const result = schema.safeParse(await response.json())
    if (!result.success) {
        console.error('Unexpected API response', path, result.error.issues);
        throw new Error('The server sent data in an unexpected format.');
    }
    return result.data;
};


/** leep so the existing blog code keeps working unchanged */
export function apiGet<T>(path: string, schema: z.ZodType<T>, options: { signal?: AbortSignal } = {}) {
    return apiRequest(path, { schema, signal: options.signal });
}
