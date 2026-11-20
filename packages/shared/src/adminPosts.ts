import { z } from 'zod';
import { POST_LIMITS, SLUG_PATTERN } from './posts.js';




// ---- What the editor sends when creating or updating a post ------------------

export const postInputSchema = z.object({
    slug: z
        .string()
        .trim()
        .min(1, 'Slug is required')
        .max(POST_LIMITS.slug, `Keep the slug under ${POST_LIMITS.slug} characters`)
        .regex(SLUG_PATTERN, 'Use lowercase letters and numbers, separated by single hyphens'),
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(POST_LIMITS.title, `Keep the title under ${POST_LIMITS.title} characters`),
    summary: z
        .string()
        .trim()
        .min(1, 'Summary is required')
        .max(POST_LIMITS.summary, `Keep the summary under ${POST_LIMITS.summary} characters`),
    body: z.string().max(POST_LIMITS.body, `The post is too long (${POST_LIMITS.body} characters max)`),
    tags: z
        .array(
            z
                .string()
                .trim()
                .min(1)
                .max(POST_LIMITS.tagLength, `Each tag can be at most ${POST_LIMITS.tagLength} characters`),
        )
        .max(POST_LIMITS.tags, `Use at most ${POST_LIMITS.tags} tags`)
        .transform((tags) => [...new Set(tags)]), // remove duplicates
    // null = draft. a date = published (or scheduled, if it's in the future)
    publishedAt: z.iso.datetime().nullable(),
});


// ---- What the admin API sends back -------------------------------------------

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
});

export const adminPostListItemSchema = adminPostSchema.omit({ body: true, summary: true });

export const adminPostListSchema = z.object({
    items: z.array(adminPostListItemSchema),
});

export type PostInput = z.infer<typeof postInputSchema>;
export type AdminPost = z.infer<typeof adminPostSchema>;
export type AdminPostListItem = z.infer<typeof adminPostListItemSchema>;