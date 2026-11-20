import { SLUG_PATTERN } from '@portfolio/shared';
import { z } from 'zod';




// only the API's own request schemas live here; the response shapes are shared
// with the web app and come from @portfolio/shared

export const PAGE_SIZE = 10;

export const postSlugParamsSchema = z.object({
  slug: z.string().max(100).regex(SLUG_PATTERN, 'Invalid post slug'),
});

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
});