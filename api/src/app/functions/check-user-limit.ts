import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import dayjs from 'dayjs'
import { eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const checkUserLimitInput = z.object({
  userId: z.string(),
  type: z.enum(['send-message']),
})

const checkUserLimitOutput = z.object({
  allowed: z.boolean(),
})

type CheckUserLimitInput = z.infer<typeof checkUserLimitInput>
type CheckUserLimitOutput = z.infer<typeof checkUserLimitOutput>

export async function checkUserLimit(
  input: CheckUserLimitInput
): Promise<Either<ResourceNotFound, CheckUserLimitOutput>> {
  const { userId, type } = checkUserLimitInput.parse(input)

  const limits = await db
    .select(getTableColumns(schema.limits))
    .from(schema.limits)
    .where(eq(schema.limits.userId, userId))

  if (limits.length === 0) {
    return makeLeft(new ResourceNotFound('Limite não encontrado.'))
  }

  const limit = limits[0]

  if (type === 'send-message') {
    let limitWasReseted = false

    if (limit.sendMessageLimitResetAt && dayjs().isAfter(limit.sendMessageLimitResetAt)) {
      await db
        .update(schema.limits)
        .set({
          sendMessageUsed: 0,
          sendMessageLimitResetAt: null,
        })
        .where(eq(schema.limits.userId, userId))

      limitWasReseted = true
    }

    if (limitWasReseted) {
      return makeRight({
        allowed: true,
      })
    }

    return makeRight({
      allowed: limit.sendMessageLimit > limit.sendMessageUsed,
    })
  }

  return makeRight({
    allowed: false,
  })
}
