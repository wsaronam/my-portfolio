import { z } from 'zod';




/** a post's address: lowercase words separated by single hyphens, e.g. "my-first-post" */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;


/** size limits for posts. the API enforces them and the editor checks them first */
export const POST_LIMITS = {
    slug: 100,
    title: 200,
    summary: 500,
    body: 100_000,
    tags: 10,
    tagLength: 30,
} as const;


// ---- Public blog API responses ----------------------------------------------

export const postSummarySchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime(),
});

export const postDetailSchema = postSummarySchema.extend({
    body: z.string(),
});

export const postListSchema = z.object({
    items: z.array(postSummarySchema),
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
});

export type PostSummary = z.infer<typeof postSummarySchema>;
export type PostDetail = z.infer<typeof postDetailSchema>;
export type PostList = z.infer<typeof postListSchema>;