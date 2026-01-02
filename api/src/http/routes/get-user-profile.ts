import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserProfile } from '@/app/functions/get-user-profile'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const getUserProfileRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/users/me',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['users'],
        operationId: 'getUserProfileRoute',
        description: 'Get user profile',
        response: {
          200: z.object({
            name: z.string().nullable(),
            email: z.string().email(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const result = await getUserProfile({ userId })

      if (isRight(result)) {
        return unwrapEither(result)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
