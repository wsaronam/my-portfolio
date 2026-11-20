import { apiGet } from "../../lib/api";
import { postDetailSchema, postListSchema } from '@portfolio/shared';




export function fetchPostList(page: number, signal?: AbortSignal) {
    const params = new URLSearchParams({ page: String(page) });
        return apiGet(`/posts?${params}`, postListSchema, { signal });
} 

export function fetchPost(slug: string, signal?: AbortSignal) {
    return apiGet(`/posts/${encodeURIComponent(slug)}`, postDetailSchema, { signal });
}