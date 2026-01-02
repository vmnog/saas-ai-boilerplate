import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authenticateFromCode } from '@/app/functions/authenticate-from-code'
import { isRight, unwrapEither } from '@/core/either'

export const authenticateFromCodeRoute: FastifyPluginAsyncZod =
  async server => {
    server.post(
      '/authenticate/code',
      {
        schema: {
          tags: ['auth'],
          operationId: 'authenticateFromCode',
          description: 'Authenticate from code',
          body: z.object({
            code: z.string(),
          }),
          response: {
            200: z.object({ token: z.string() }),
            401: z.object({ message: z.string() }),
            400: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { code } = request.body

        const result = await authenticateFromCode({ code })

        if (isRight(result)) {
          return reply.send(unwrapEither(result))
        }

        const error = unwrapEither(result)

        switch (error.constructor.name) {
          case 'ExpiredAuthenticationCode':
            return reply.status(401).send({ message: error.message })
          default:
            return reply.status(400).send({ message: error.message })
        }
      }
    )
  }
