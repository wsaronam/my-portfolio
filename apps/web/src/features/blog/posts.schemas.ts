import { z } from 'zod';




// Mirrors API's response schemas.
// browser checks every response against them (no trust)

export const postSummarySchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime()
})

export const postListSchema = z.object({
    items: z.array(postSummarySchema),
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int()
})

export type PostSummary = z.infer<typeof postSummarySchema>;
export type PostList = z.infer<typeof postListSchema>;