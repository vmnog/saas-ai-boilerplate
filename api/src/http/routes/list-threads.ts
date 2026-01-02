import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { listThreads } from '@/app/functions/list-threads'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const listThreadsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/threads',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'listThreads',
        description: 'List all threads',
        response: {
          200:
            z.array(z.object({
              id: z.string(),
              openaiThreadId: z.string(),
              title: z.string().nullable(),
              archivedAt: z.date().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            })),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const result = await listThreads({ userId })

      if (isRight(result)) {
        const { threads } = unwrapEither(result)
        return reply.status(200).send(threads)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ResourceNotFound':
          return reply.status(404).send({ message: 'Usuário não encontrado' })
        default:
          return reply
            .status(400)
            .send({ message: 'Não foi possível listar as threads' })
      }
    }
  )
}