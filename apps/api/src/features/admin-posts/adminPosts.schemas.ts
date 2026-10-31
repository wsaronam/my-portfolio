import { z } from "zod";
import { SLUG_PATTERN } from "../posts/posts.schemas.js";




export const postIdParamsSchema = z.object({
    id: z.uuid('Invalid post id')
})


/** what the editor sends when creating or updating a post */
export const postInputSchema = z.object({
    slug: z
        .string()
        .max(100)
        .regex(SLUG_PATTERN, 'Slug must be lowercase words separated by single hyphens'),
    title: z.string().trim().min(1, 'Title is required').max(200),
    summary: z.string().trim().min(1, 'Summary is required').max(500),
    body: z.string().max(100_000),
    tags: z
        .array(z.string().trim().min(1).max(30))
        .max(10)
        .transform((tags) => [...new Set(tags)]),
    // null = draft. A date = published (or scheduled, if it's in the future).
    publishedAt: z.iso.datetime().nullable(),
})


/** everything about a post, for the admin area only (includes drafts) */
export const adminPostSchema = z.object({
    id: z.uuid(),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
})


export const adminPostListItemSchema = adminPostSchema.omit({ body: true, summary: true });

export const adminPostListSchema = z.object({
    items: z.array(adminPostListItemSchema),
})

export type PostInput = z.infer<typeof postInputSchema>;
export type AdminPost = z.infer<typeof adminPostSchema>;