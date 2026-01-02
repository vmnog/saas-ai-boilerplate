import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateUserProfile } from '@/app/functions/update-user-profile'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const updateUserProfileRoute: FastifyPluginAsyncZod = async server => {
  server.patch(
    '/users/me',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['users'],
        operationId: 'updateUserProfileRoute',
        description: 'Update user profile',
        body: z.object({
          name: z.string(),
        }),
        response: {
          204: z.void(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { name } = request.body

      const result = await updateUserProfile({
        userId,
        name,
      })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message })

      }
    }
  )
}
