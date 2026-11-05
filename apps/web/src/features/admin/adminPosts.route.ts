import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { withAdminSession } from "../auth/redirects";
import { fetchAdminPosts, deletePost } from "./adminPosts.api";
import { z } from 'zod';
import { ApiError } from "../../lib/api";




export async function adminPostsLoader({ request }: LoaderFunctionArgs) {
    return withAdminSession(request, fetchAdminPosts(request.signal));
}


const deleteFormSchema = z.object({
    intent: z.literal('delete'),
    id: z.uuid(),
})


/** handles the Delete buttons on the posts list */
export async function adminPostsAction({ request }: ActionFunctionArgs) {
    const form = deleteFormSchema.safeParse(Object.fromEntries(await request.formData()));

    if (!form.success) {
        throw new Response('Invalid form submission', { status: 400 });
    }

    try {
        await withAdminSession(request, deletePost(form.data.id));
    } 
    catch (error) {
        // already gone (ex deleted in another tab) is the result we wanted anyway
        if (!(error instanceof ApiError && error.status === 404)) {
            throw error;
        }
    }

    return { deleted: form.data.id };
}