import { z } from "zod";




/** API error template/shape */
export const errorResponseSchema = z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string()
})