import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, eq, isNotNull, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const deleteAllArchivedThreadsInput = z.object({
  userId: z.string(),
})

const deleteAllArchivedThreadsOutput = z.object({
  deletedThreadsAmount: z.number(),
})

type DeleteAllArchivedThreadsInput = z.infer<typeof deleteAllArchivedThreadsInput>
export type DeleteAllArchivedThreadsOutput = z.infer<typeof deleteAllArchivedThreadsOutput>

export async function deleteAllArchivedThreads(
  input: DeleteAllArchivedThreadsInput
): Promise<Either<ResourceNotFound, DeleteAllArchivedThreadsOutput>> {
  const { userId } = deleteAllArchivedThreadsInput.parse(input)

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (user.length === 0) {
    return makeLeft(new ResourceNotFound('Usuário não encontrado.'))
  }

  const result = await db
    .update(schema.threads)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.threads.userId, userId),
        isNotNull(schema.threads.archivedAt),
        isNull(schema.threads.deletedAt)
      )
    )
    .returning()

  return makeRight({ deletedThreadsAmount: result.length })
}
