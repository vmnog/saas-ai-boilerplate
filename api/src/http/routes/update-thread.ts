import { updateThread } from '@/app/functions/update-thread'
import { isRight, unwrapEither } from '@/core/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticateHook } from '../hooks/auth'

export const updateThreadRoute: FastifyPluginAsyncZod = async server => {
    server.patch(
        '/threads/:openaiThreadId',
        {
            onRequest: [authenticateHook],
            schema: {
                tags: ['threads'],
                operationId: 'updateThread',
                description: 'Update a thread',
                params: z.object({
                    openaiThreadId: z.string(),
                }),
                body: z.object({
                    archive: z.boolean().optional(),
                    title: z.string().optional(),
                }),
                response: {
                    204: z.void(),
                    400: z.object({ message: z.string() }),
                    403: z.object({ message: z.string() }),
                    404: z.object({ message: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { openaiThreadId } = request.params
            const userId = request.user.sub
            const { archive, title } = request.body

            const result = await updateThread({
                openaiThreadId,
                userId,
                archive,
                title,
            })

            if (isRight(result)) {
                return reply.status(204).send()
            }

            const error = unwrapEither(result)

            switch (error.constructor.name) {
                case 'ResourceNotFound':
                    return reply.status(404).send({ message: error.message })
                case 'NotAuthorized':
                    return reply.status(403).send({ message: error.message })
                default:
                    return reply.status(400).send({ message: error.message })
            }
        },
    )
}
