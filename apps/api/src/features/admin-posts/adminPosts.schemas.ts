import { z } from 'zod';




// the post input and response shapes are shared with the web app (@portfolio/shared)

export const postIdParamsSchema = z.object({
  id: z.uuid('Invalid post id'),
});