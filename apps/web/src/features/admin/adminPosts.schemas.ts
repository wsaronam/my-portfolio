import { postInputSchema } from '@portfolio/shared';
import { z } from 'zod';




// the API's request and response shapes come from @portfolio/shared.
// this file only holds what is specific to the editor *form*


// ---- What the editor form submits -----------------------------------------

export const PUBLISH_MODES = ['draft', 'now', 'schedule'] as const;
export type PublishMode = (typeof PUBLISH_MODES)[number];


/**
 * validates the raw form fields. every post field reuses the API's own rule from
 * postInputSchema, so the editor and the API can never disagree (same limits,
 * same messages). the API still validates again: the browser can't be trusted
 */
export const postFormSchema = z
    .object({
      title: postInputSchema.shape.title,
      slug: postInputSchema.shape.slug,
      summary: postInputSchema.shape.summary,
      body: postInputSchema.shape.body,
      // the form has one text box: "python, networking" → ["python", "networking"],
      // then the API's tag rules check the list
      tags: z
        .string()
        .transform((value) => value.split(',').map((tag) => tag.trim()).filter(Boolean))
        .pipe(postInputSchema.shape.tags),
      publishMode: z.enum(PUBLISH_MODES),
      // the <input type="datetime-local"> value, e.g. "2026-12-01T09:30". only used when scheduling
      scheduledFor: z.string().optional(),
      // the post's current publish date (edit page only), so "Published" keeps its original date
      currentPublishedAt: z.string().optional(),
    })
    .superRefine((form, ctx) => {
      if (form.publishMode !== 'schedule') return
      const date = new Date(form.scheduledFor ?? '')
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['scheduledFor'], message: 'Pick a date and time' })
      } 
      else if (date <= new Date()) {
        ctx.addIssue({ code: 'custom', path: ['scheduledFor'], message: 'Pick a time in the future' })
      }
    });


export type PostFormValues = z.infer<typeof postFormSchema>;