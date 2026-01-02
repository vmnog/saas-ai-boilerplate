import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserLimits } from '@/app/functions/get-user-limits'
import { isRight, unwrapEither } from '@/core/either'
import { authenticateHook } from '../hooks/auth'

export const getUserLimitsRoute: FastifyPluginAsyncZod = async server => {
    server.get(
        '/users/me/limits',
        {
            onRequest: [authenticateHook],
            schema: {
                tags: ['users'],
                operationId: 'getUserLimitsRoute',
                description: 'Get user limits',
                response: {
                    200: z.object({
                        used: z.number(),
                        limit: z.number(),
                        resetAt: z.date().nullable(),
                    }),
                    400: z.object({ message: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const userId = request.user.sub

            const result = await getUserLimits({ userId })

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