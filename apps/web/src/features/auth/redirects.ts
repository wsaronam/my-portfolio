import { redirect } from "react-router";
import { ApiError } from "../../lib/api";




const ADMIN_HOME = '/admin';


/**
 * where to go after logging in. only our own admin pages are allowed:
 * accepting any address would let an attacker craft a login link that
 * sends you to their site afterwards (an "open redirect")
 */
export function safeRedirectTarget(value: string | null): string {
    if (value === ADMIN_HOME || value?.startsWith(`${ADMIN_HOME}/`)) {
        return value;
    }
    return ADMIN_HOME;
}


/** sends the visitor to the login page, remembering where they were going */
export function loginRedirect(request: Request) {
    const url = new URL(request.url);
    const params = new URLSearchParams({ redirectTo: url.pathname + url.search });
    return redirect(`/admin/login?${params}`);
}


/** waits for an admin API call; if the session has expired, goes to the login page instead */
export async function withAdminSession<T>(request: Request, call: Promise<T>): Promise<T> {
    try {
        return await call;
    } 
    catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            throw loginRedirect(request);
        }
        throw error;
    }
}