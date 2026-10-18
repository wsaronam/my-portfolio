import { z } from "zod";




/** same rule as the database check constraint: lowercase words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const PAGE_SIZE = 10;



// ---------- Requests: what we accept ----------

export const postSlugParamsSchema = z.object({
    slug: z.string().max(100).regex(SLUG_PATTERN, 'Invalid post slug')
});

export const listPostsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).max(1000).default(1)
})



// ---------- Responses: what we send back ----------

export const postSummarySchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime()
})

export const postDetailSchema = postSummarySchema.extend({
    body: z.string(),
})

export const postListResponseSchema = z.object({
    items: z.array(postSummarySchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number()
})

export type PostSummary = z.infer<typeof postSummarySchema>;
export type PostDetail = z.infer<typeof postDetailSchema>;