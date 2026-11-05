export type PostStatus = 'draft' | 'scheduled' | 'published';


export const POST_STATUS_LABELS: Record<PostStatus, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    published: 'Published',
}


/** same rule as the API: 
 * no date = draft, 
 * future date = scheduled, 
 * past date = published 
 * */
export function getPostStatus(publishedAt: string | null, now = new Date()): PostStatus {
    if (!publishedAt) return 'draft';
    return new Date(publishedAt) > now ? 'scheduled' : 'published';
}