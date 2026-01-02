import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'

const deleteThreadInput = z.object({
  openaiThreadId: z.string(),
  userId: z.string(),
})

const deleteThreadOutput = z.object({
  id: z.string(),
  deletedAt: z.date().nullable(),
})

type DeleteThreadInput = z.infer<typeof deleteThreadInput>
export type DeleteThreadOutput = z.infer<typeof deleteThreadOutput>

export async function deleteThread(
  input: DeleteThreadInput
): Promise<Either<ResourceNotFound | NotAuthorized, DeleteThreadOutput>> {
  const { openaiThreadId, userId } = deleteThreadInput.parse(input)

  const threads = await db
    .select()
    .from(schema.threads)
    .where(eq(schema.threads.openaiThreadId, openaiThreadId))

  if (threads.length === 0) {
    return makeLeft(new ResourceNotFound('Thread não encontrada.'))
  }

  if (threads[0].userId !== userId) {
    return makeLeft(new NotAuthorized('Você não tem permissão para deletar esta thread.'))
  }

  const [deletedThread] = await db
    .update(schema.threads)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.threads.openaiThreadId, openaiThreadId))
    .returning()

  return makeRight(deletedThread)
}
