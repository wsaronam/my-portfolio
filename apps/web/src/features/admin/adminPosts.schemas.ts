import { z } from 'zod';
import { SLUG_PATTERN } from '../blog/posts.schemas';




// ---- what the API sends us ------------------------------------------------

/** everything about one post (the editor needs the body and summary too) */
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


export type AdminPostListItem = z.infer<typeof adminPostListItemSchema>;
export type AdminPost = z.infer<typeof adminPostSchema>;




// ---- what the editor form submits -----------------------------------------

export const PUBLISH_MODES = ['draft', 'now', 'schedule'] as const;
export type PublishMode = (typeof PUBLISH_MODES)[number];


/**
 * validates the raw form fields. the limits match the API's postInputSchema,
 * so mistakes are shown next to the right field before anything is sent.
 * (the API still validates everything again: the browser can't be trusted.)
 */
export const postFormSchema = z
  .object({
      title: z.string().trim().min(1, 'Title is required').max(200, 'Keep the title under 200 characters'),
      slug: z
        .string()
        .trim()
        .min(1, 'Slug is required')
        .max(100, 'Keep the slug under 100 characters')
        .regex(SLUG_PATTERN, 'Use lowercase letters and numbers, separated by single hyphens'),
      summary: z.string().trim().min(1, 'Summary is required').max(500, 'Keep the summary under 500 characters'),
      body: z.string().max(100_000, 'The post is too long (100,000 characters max)'),
      // "python, networking" -> ["python", "networking"]
      tags: z
        .string()
        .transform((value) => value.split(',').map((tag) => tag.trim()).filter(Boolean))
        .pipe(
          z
            .array(z.string().max(30, 'Each tag can be at most 30 characters'))
            .max(10, 'Use at most 10 tags'),
        ),
      publishMode: z.enum(PUBLISH_MODES),
      // the <input type="datetime-local"> value, e.g. "2026-12-01T09:30". only used when scheduling.
      scheduledFor: z.string().optional(),
      // the post's current publish date (edit page only), so "Published" keeps its original date
      currentPublishedAt: z.string().optional(),
    })
    .superRefine((form, ctx) => {
      if (form.publishMode !== 'schedule') return;
      const date = new Date(form.scheduledFor ?? '');
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['scheduledFor'], message: 'Pick a date and time' });
      } else if (date <= new Date()) {
        ctx.addIssue({ code: 'custom', path: ['scheduledFor'], message: 'Pick a time in the future' });
      }
  })


export type PostFormValues = z.infer<typeof postFormSchema>;


/** the JSON body the API's POST/PUT endpoints expect */
export type PostInput = {
    slug: string
    title: string
    summary: string
    body: string
    tags: string[]
    publishedAt: string | null
};