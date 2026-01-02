import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getThread } from '@/app/functions/get-thread'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const getThreadRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/threads/:openaiThreadId',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'getThread',
        description: 'Get thread details',
        params: z.object({
          openaiThreadId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            title: z.string().nullable(),
            openaiThreadId: z.string(),
            archivedAt: z.date().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { openaiThreadId } = request.params

      const result = await getThread({ userId, openaiThreadId })

      if (isRight(result)) {
        return unwrapEither(result)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ResourceNotFound':
          return reply.status(404).send({ message: 'Thread não encontrada' })
        default:
          return reply.status(400).send({ message: 'Não foi possível obter a thread' })
      }
    }
  )
}
