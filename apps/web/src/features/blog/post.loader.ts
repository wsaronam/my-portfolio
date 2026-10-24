import  { type LoaderFunctionArgs, data } from "react-router";
import { SLUG_PATTERN } from "./posts.schemas";
import { fetchPost } from "./posts.api";




/** loads one published post. Unknown or invalid slugs become a 404 */
export async function postLoader({ params, request }: LoaderFunctionArgs) {
    const slug = params['slug'];

    if (!slug || !SLUG_PATTERN.test(slug)) {
        throw data('Post not found', { status: 404 })
    }

    return fetchPost(slug, request.signal);
}