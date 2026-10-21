import type { z } from 'zod';




// Error response from API
export class ApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}


// Gets JSON from API and checks it againt Zod schema
// Schema guarantees that data has the shape for UI
export async function apiGet<T>(
    path: string,
    schema: z.ZodType<T>,
    options: { signal?: AbortSignal } = {}
): Promise<T> {
    const response = await fetch(`/api${path}`, {
        headers: { Accept: 'application/json' },
        signal: options.signal
    })

    if (!response.ok) {
        throw new ApiError(response.status, `GET /api${path} failed with status ${response.status}`);
    }

    const result = schema.safeParse(await response.json());

    if (!result.success) {
        console.error('Unexpected API response', path, result.error.issues);
        throw new Error('The server sent data in an unexpected format.');
    }

    return result.data;
}