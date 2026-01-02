import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  type ListArchivedThreadsOutput,
  listArchivedThreads,
} from '@/app/functions/list-archived-threads'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const listArchivedThreadsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/threads/archived',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'listArchivedThreads',
        description: 'List all archived threads',
        response: {
          200: z.array(
            z.object({
              thread: z.object({
                id: z.string(),
                openaiThreadId: z.string(),
                title: z.string().nullable(),
                archivedAt: z.date().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
              messagesAmount: z.number(),
            })
          ),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const result = await listArchivedThreads({ userId })

      if (isRight(result)) {
        const threads = unwrapEither(result) as ListArchivedThreadsOutput
        return reply.status(200).send(threads)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ResourceNotFound':
          return reply.status(404).send({ message: 'Usuário não encontrado' })
        default:
          return reply
            .status(400)
            .send({
              message: 'Não foi possível listar as conversas arquivadas',
            })
      }
    }
  )
}
