import { safeRedirectTarget } from "./redirects";
import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "react-router";
import { fetchCurrentUser, login } from "./auth.api";
import { ApiError } from "../../lib/api";




function redirectTarget(request: Request) {
    return safeRedirectTarget(new URL(request.url).searchParams.get('redirectTo'));
}


/** skip the form if already logged in */
export async function loginLoader({ request }: LoaderFunctionArgs) {
    const user = await fetchCurrentUser(request.signal);
    if (user) {
        throw redirect(redirectTarget(request));
    }
    return null;
}


/** runs when the login form is submitted */
export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
        await login(email, password);
    } 
    catch (error) {
        if (error instanceof ApiError && error.status === 400) {
            return { error: 'Enter a valid email address and your password.' };
        }
        if (error instanceof ApiError && error.status === 401) {
            return { error: 'Invalid email or password.' };
        }
        if (error instanceof ApiError && error.status === 429) {
            return { error: 'Too many login attempts. Please wait 15 minutes and try again.' };
        }
        throw error;
    }

    return redirect(redirectTarget(request));
}