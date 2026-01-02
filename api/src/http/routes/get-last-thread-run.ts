import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { schema } from '@/db/schema'
import { openai } from '@/openai/client'
import { eq } from 'drizzle-orm'
import { authenticateHook } from '../hooks/auth'

export const getLastThreadRunRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/threads/:openaiThreadId/runs/last',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'getLastThreadRun',
        description: 'Get the last run from a thread',
        params: z.object({
          openaiThreadId: z.string()
        }),
        response: {
          200: z.any(),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      const { openaiThreadId } = request.params
      const userId = request.user.sub

      const thread = await db
        .select()
        .from(schema.threads)
        .where(eq(schema.threads.openaiThreadId, openaiThreadId))

      if (thread.length === 0) {
        return reply.status(404).send({ message: 'Esta conversa não existe' })
      }

      if (thread[0].userId !== userId) {
        return reply.status(403).send({ message: 'Você não tem permissão para acessar esta conversa' })
      }

      const runs = await openai.beta.threads.runs.list(openaiThreadId, {
        limit: 1,
        order: 'desc'
      })

      if (runs.data.length === 0) {
        return reply.status(404).send({ message: 'Nenhuma execução encontrada para esta conversa' })
      }

      return runs.data[0]
    }
  )
}
