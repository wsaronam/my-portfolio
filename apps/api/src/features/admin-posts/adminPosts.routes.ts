import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { requireAuth } from "../auth/requireAuth.js";
import { createAdminPostsRepository } from "./adminPosts.repository.js";
import {
    adminPostListSchema,
    postIdParamsSchema,
    adminPostSchema,
    postInputSchema
} from './adminPosts.schemas.js';
import { errorResponseSchema } from "../../http/schemas.js";
import { isUniqueViolation } from "../../db/errors.js";
import { z } from 'zod';




const NOT_FOUND = { statusCode: 404, error: 'Not Found', message: 'Post not found' };
const SLUG_TAKEN = { statusCode: 409, error: 'Conflict', message: 'Another post already uses this slug.' };


export const adminPostsRoutes: FastifyPluginAsyncZod = async (app) => {
    // every route in this plugin requires a logged-in admin. adding the check here,
    // once, means a new route can't accidentally be left unprotected
    app.addHook('preHandler', requireAuth);

    // admin data is private and changes often: never cache it
    app.addHook('onSend', async (_request, reply) => {
        reply.header('cache-control', 'no-store');
    });


    const repository = createAdminPostsRepository(app.db);


    app.get('/', { schema: { response: { 200: adminPostListSchema } } }, async () => {
        return { items: await repository.listAll() };
    });

    app.get(
        '/:id',
        {
            schema: {
                params: postIdParamsSchema,
                response: { 200: adminPostSchema, 404: errorResponseSchema },
            },
        },
        async (request, reply) => {
            const post = await repository.findById(request.params.id);
            return post ?? reply.code(404).send(NOT_FOUND);
        },
    );


    app.post(
        '/',
        {
            schema: {
                body: postInputSchema,
                response: { 201: adminPostSchema, 409: errorResponseSchema },
            },
        },
        async (request, reply) => {
            try {
                const post = await repository.create(request.body);
                request.log.info({ userId: request.user?.id, postId: post.id }, 'Post created');
                return reply.code(201).send(post);
            } 
            catch (error) {
                if (isUniqueViolation(error)) return reply.code(409).send(SLUG_TAKEN);
                throw error;
            }
        },
    );


    app.put(
        '/:id',
        {
            schema: {
                params: postIdParamsSchema,
                body: postInputSchema,
                response: { 200: adminPostSchema, 404: errorResponseSchema, 409: errorResponseSchema },
            },
        },
        async (request, reply) => {
            try {
                const post = await repository.update(request.params.id, request.body);
                if (!post) return reply.code(404).send(NOT_FOUND);
                request.log.info({ userId: request.user?.id, postId: post.id }, 'Post updated');
                return post;
            } 
            catch (error) {
                if (isUniqueViolation(error)) return reply.code(409).send(SLUG_TAKEN);
                throw error;
            }
        },
    );


    app.delete(
        '/:id',
        {
            schema: {
                params: postIdParamsSchema,
                response: { 204: z.null(), 404: errorResponseSchema },
            },
        },
        async (request, reply) => {
            const deleted = await repository.remove(request.params.id);
            if (!deleted) return reply.code(404).send(NOT_FOUND);
            request.log.info({ userId: request.user?.id, postId: request.params.id }, 'Post deleted');
            return reply.code(204).send(null);
        },
    );
}