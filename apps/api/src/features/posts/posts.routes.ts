import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createPostsRepository } from "./posts.repository.js";
import { errorResponseSchema } from "../../http/schemas.js";
import { 
    listPostsQuerySchema,
    postListResponseSchema,
    PAGE_SIZE,
    postSlugParamsSchema,
    postDetailSchema
 } from "./posts.schemas.js";




/** Browsers and CDNs may reuse a response for 60 seconds instead of asking again. */
const PUBLIC_CACHE = 'public, max-age=60';


export const postsRoutes: FastifyPluginAsyncZod = async (app) => {
    const repository = createPostsRepository(app.db);

    app.get(
        '/',
        {
            schema: {
                querystring: listPostsQuerySchema,
                response: { 200: postListResponseSchema },
            },
        },
        async (request, reply) => {
            const { page } = request.query
            const { items, total } = await repository.listPublished({
                limit: PAGE_SIZE,
                offset: (page - 1) * PAGE_SIZE,
            })

            reply.header('cache-control', PUBLIC_CACHE);
            return {
                items,
                page,
                pageSize: PAGE_SIZE,
                total,
                totalPages: Math.ceil(total / PAGE_SIZE)
            }
        }
    )

    app.get(
        '/:slug',
        {
            schema: {
                params: postSlugParamsSchema,
                response: { 200: postDetailSchema, 404: errorResponseSchema },
            },
        },
        async (request, reply) => {
            const post = await repository.findPublishedBySlug(request.params.slug);

            if (!post) {
                return reply.code(404).send({
                    statusCode: 404,
                    error: 'Not Found',
                    message: 'Post not found'
                });
            }

            reply.header('cache-control', PUBLIC_CACHE);
            return post;
        }
    )
}