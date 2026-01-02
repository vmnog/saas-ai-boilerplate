import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const updateUserLimitInput = z.object({
  userId: z.string(),
  type: z.enum(['send-message']),
  amount: z.number(),
})
const updateUserLimitOutput = z.object({
  id: z.string(),
  userId: z.string(),
  sendMessageLimit: z.number(),
  sendMessageUsed: z.number(),
  sendMessageLimitResetAt: z.date().nullable(),
})

type UpdateUserLimitInput = z.infer<typeof updateUserLimitInput>
export type UpdateUserLimitOutput = z.infer<typeof updateUserLimitOutput>

export async function updateUserLimit(
  input: UpdateUserLimitInput
): Promise<Either<ResourceNotFound, UpdateUserLimitOutput>> {
  const { userId, type, amount } = updateUserLimitInput.parse(input)

  const currentLimits = await db
    .select()
    .from(schema.limits)
    .where(eq(schema.limits.userId, userId))

  if (currentLimits.length === 0) {
    return makeLeft(new ResourceNotFound('Limite não encontrado.'))
  }

  const currentLimit = currentLimits[0]

  if (type === 'send-message') {
    const limitUsedWithNewMessage = currentLimit.sendMessageUsed + amount
    const willExceedLimit = amount > 0 && limitUsedWithNewMessage >= currentLimit.sendMessageLimit

    const resetTime = process.env.NODE_ENV === 'production' ? dayjs().add(4, 'hours') : dayjs().add(1, 'minutes')

    if (willExceedLimit) {
      await db
        .update(schema.limits)
        .set({
          sendMessageLimitResetAt: resetTime.toDate(),
        })
        .where(eq(schema.limits.userId, userId))
    }

    const newSendMessageUsed = currentLimit.sendMessageUsed + amount

    const updatedLimit = await db
      .update(schema.limits)
      .set({
        sendMessageUsed: newSendMessageUsed,
      })
      .where(eq(schema.limits.userId, userId))
      .returning()

    return makeRight(updatedLimit[0])
  }

  return makeLeft(new ResourceNotFound('Não foi possível atualizar o limite do usuário.'))
}
