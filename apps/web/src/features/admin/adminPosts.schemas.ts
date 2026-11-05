import { z } from 'zod';




// mirrors the API's admin list response
export const adminPostListItemSchema = z.object({
    id: z.uuid(),
    slug: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});


export const adminPostListSchema = z.object({
  items: z.array(adminPostListItemSchema),
});


export type AdminPostListItem = z.infer<typeof adminPostListItemSchema>;