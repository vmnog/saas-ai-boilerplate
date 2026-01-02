import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const getThreadInput = z.object({
  userId: z.string(),
  openaiThreadId: z.string(),
})

const getThreadOutput = z.object({
  id: z.string(),
  title: z.string().nullable(),
  openaiThreadId: z.string(),
  archivedAt: z.date().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

type GetThreadInput = z.infer<typeof getThreadInput>
type GetThreadOutput = z.infer<typeof getThreadOutput>

export async function getThread(
  input: GetThreadInput
): Promise<Either<ResourceNotFound, GetThreadOutput>> {
  const { userId, openaiThreadId } = getThreadInput.parse(input)

  const threads = await db
    .select()
    .from(schema.threads)
    .where(
      and(
        eq(schema.threads.userId, userId),
        eq(schema.threads.openaiThreadId, openaiThreadId)
      )
    )

  if (threads.length === 0) {
    return makeLeft(new ResourceNotFound('Thread não encontrada.'))
  }

  const thread = threads[0]

  return makeRight(thread)
}
