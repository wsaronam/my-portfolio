import { apiRequest } from '../../lib/api';
import { adminPostListSchema, adminPostSchema, type PostInput } from './adminPosts.schemas';




export function fetchAdminPosts(signal?: AbortSignal) {
    return apiRequest('/admin/posts', { schema: adminPostListSchema, signal });
}

export function fetchAdminPost(id: string, signal?: AbortSignal) {
    return apiRequest(`/admin/posts/${encodeURIComponent(id)}`, { schema: adminPostSchema, signal });
}

export function createPost(input: PostInput) {
    return apiRequest('/admin/posts', { method: 'POST', body: input, schema: adminPostSchema });
}

export function updatePost(id: string, input: PostInput) {
    return apiRequest(`/admin/posts/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: input,
        schema: adminPostSchema,
    });
}


export function deletePost(id: string) {
    return apiRequest(`/admin/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}