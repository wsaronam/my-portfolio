import { apiGet } from "../../lib/api";
import { postListSchema } from './posts.schemas'




export function fetchPostList(page: number, signal?: AbortSignal) {
    const params = new URLSearchParams({ page: String(page) });
        return apiGet(`/posts?${params}`, postListSchema, { signal });
} 