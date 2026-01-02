import { isRight, unwrapEither } from '@/core/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticateHook } from '../hooks/auth'
import { deleteAllArchivedThreads } from '@/app/functions/delete-all-archived-threads'

export const deleteAllArchivedThreadsRoute: FastifyPluginAsyncZod = async server => {
    server.delete(
        '/threads/archived',
        {
            onRequest: [authenticateHook],
            schema: {
                tags: ['threads'],
                operationId: 'deleteAllArchivedThreads',
                description: 'Delete all archived threads',
                response: {
                    204: z.void(),
                    400: z.object({ message: z.string() }),
                    403: z.object({ message: z.string() }),
                    404: z.object({ message: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user.sub

            const result = await deleteAllArchivedThreads({
                userId,
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
