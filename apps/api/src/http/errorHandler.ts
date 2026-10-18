import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";




/**
 * turns every error into a safe, consistent JSON response.
 * visitors get a clear message; internal details only go to the server logs.
 */
export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
    if (hasZodFastifySchemaValidationErrors(error)) {
        const details = error.validation.map((issue) => issue.message).join('; ')
        return reply.code(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: `Invalid request: ${details}`,
        })
    }

    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
        request.log.error(error, 'Unhandled error')
        return reply.code(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong. Please try again later.',
        })
    }

    return reply.code(statusCode).send({
        statusCode,
        error: error.name,
        message: error.message,
    })
}