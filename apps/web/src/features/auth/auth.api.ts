import { z } from 'zod';
import { ApiError, apiRequest } from '../../lib/api';




const currentUserSchema = z.object({ email: z.string() });
export type CurrentUser = z.infer<typeof currentUserSchema>;


export function login(email: string, password: string) {
    return apiRequest('/auth/login', { method: 'POST', body: { email, password } });
}

export function logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
}


/** the logged-in admin, or null if nobody is logged in */
export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
    try {
        return await apiRequest('/auth/me', { schema: currentUserSchema, signal });
    } 
    catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }
        throw error;
    }
}