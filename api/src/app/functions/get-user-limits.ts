import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const getUserLimitsInput = z.object({
  userId: z.string(),
})

const getUserLimitsOutput = z.object({
  used: z.number(),
  limit: z.number(),
  resetAt: z.date().nullable(),
})

type GetUserLimitsInput = z.infer<typeof getUserLimitsInput>
type GetUserLimitsOutput = z.infer<typeof getUserLimitsOutput>

export async function getUserLimits(
  input: GetUserLimitsInput
): Promise<Either<ResourceNotFound, GetUserLimitsOutput>> {
  const { userId } = getUserLimitsInput.parse(input)

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound('Usuário não encontrado.'))
  }

  const limits = await db
    .select({
      sendMessageUsed: schema.limits.sendMessageUsed,
      sendMessageLimit: schema.limits.sendMessageLimit,
      sendMessageLimitResetAt: schema.limits.sendMessageLimitResetAt,
    })
    .from(schema.limits)
    .where(eq(schema.limits.userId, userId))

  if (limits.length === 0) {
    return makeLeft(new ResourceNotFound('Limites não encontrados.'))
  }

  const limit = limits[0]

  return makeRight({
    used: limit.sendMessageUsed,
    limit: limit.sendMessageLimit,
    resetAt: limit.sendMessageLimitResetAt,
  })
}
