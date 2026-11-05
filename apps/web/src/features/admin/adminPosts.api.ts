import { apiRequest } from '../../lib/api';
import { adminPostListSchema } from './adminPosts.schemas';




export function fetchAdminPosts(signal?: AbortSignal) {
    return apiRequest('/admin/posts', { schema: adminPostListSchema, signal });
}


export function deletePost(id: string) {
    return apiRequest(`/admin/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}