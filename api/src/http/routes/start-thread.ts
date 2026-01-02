import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { startThread } from '@/app/functions/start-thread'
import { isRight, unwrapEither } from '@/core/either'
import { createOpenAIThread } from '@/openai/create-openai-thread'
import { authenticateHook } from '../hooks/auth'

export const startThreadRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/threads',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'startThread',
        description: 'Start a new thread',
        response: {
          201: z.object({
            id: z.string(),
            title: z.string(),
            openaiThreadId: z.string(),
            created_at: z.number(),
            messages: z.array(z.unknown()),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { thread } = await createOpenAIThread()
      const result = await startThread({ openaiThreadId: thread.id, userId })

      if (isRight(result)) {
        const response = unwrapEither(result)
        return reply.status(201).send({
          id: response.id,
          title: response.title,
          created_at: response.createdAt,
          openaiThreadId: response.openaiThreadId,
          messages: response.messages,
        })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ResourceNotFound':
          return reply.status(404).send({ message: 'Usuário não encontrado' })
        default:
          return reply
            .status(400)
            .send({ message: 'Não foi possível criar a thread' })
      }
    }
  )
}
