import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'

const updateThreadInput = z.object({
  openaiThreadId: z.string(),
  userId: z.string(),
  archive: z.boolean().optional(),
  title: z.string().optional(),
})

const updateThreadOutput = z.object({
  id: z.string(),
  title: z.string().nullable(),
  archivedAt: z.date().nullable(),
  updatedAt: z.date(),
})

type UpdateThreadInput = z.infer<typeof updateThreadInput>
type UpdateThreadOutput = z.infer<typeof updateThreadOutput>

export async function updateThread(
  input: UpdateThreadInput
): Promise<Either<ResourceNotFound | NotAuthorized, UpdateThreadOutput>> {
  const { openaiThreadId, userId, archive, title } = updateThreadInput.parse(input)

  const threads = await db
    .select()
    .from(schema.threads)
    .where(eq(schema.threads.openaiThreadId, openaiThreadId))

  if (threads.length === 0) {
    return makeLeft(new ResourceNotFound('Thread não encontrada.'))
  }

  if (threads[0].userId !== userId) {
    return makeLeft(new NotAuthorized('Você não tem permissão para atualizar esta thread.'))
  }

  const updateData: Partial<typeof schema.threads.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (archive !== undefined) {
    updateData.archivedAt = archive ? new Date() : null
  }

  if (title !== undefined) {
    updateData.title = title
  }

  const [updatedThread] = await db
    .update(schema.threads)
    .set(updateData)
    .where(eq(schema.threads.openaiThreadId, openaiThreadId))
    .returning()

  return makeRight(updatedThread)
}
