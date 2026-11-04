import type { LoaderFunctionArgs } from "react-router";
import { fetchCurrentUser } from "../auth/auth.api";
import { loginRedirect } from "../auth/redirects";




/** every /admin page goes through this first: not logged in -> login page */
export async function adminLayoutLoader({ request }: LoaderFunctionArgs) {
    const user = await fetchCurrentUser(request.signal);

    if (!user) {
        throw loginRedirect(request);
    }
    
    return user;
}