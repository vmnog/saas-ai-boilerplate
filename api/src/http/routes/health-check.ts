import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/health',
    {
      schema: {
        tags: ['system'],
        operationId: 'healthCheck',
        description: 'Check if the system is up and running',
        response: {
          200: z.object({
            message: z.literal('OK'),
          }),
        },
      },
    },
    async () => {
      return {
        message: 'OK' as const,
      }
    }
  )
}
