import { z } from 'zod';




export const loginBodySchema = z.object({
    email: z
        .email()
        .max(254)
        .transform((email) => email.toLowerCase()),
    // a maximum length matters: hashing a 10 MB "password" would tie up the server
    password: z.string().min(1).max(256),
})


export const meResponseSchema = z.object({
    email: z.string(),
})