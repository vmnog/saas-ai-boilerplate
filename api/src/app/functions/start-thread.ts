import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'
import { ThreadAlreadyExists } from '../errors/thread-already-exists'

const startThreadInput = z.object({
    openaiThreadId: z.string(),
    userId: z.string(),
})

const startThreadOutput = z.object({
    id: z.string(),
    title: z.string(),
    openaiThreadId: z.string(),
    createdAt: z.number(),
    messages: z.array(z.unknown()),
})

type StartThreadInput = z.infer<typeof startThreadInput>
type StartThreadOutput = z.infer<typeof startThreadOutput>

export async function startThread(
    input: StartThreadInput
): Promise<Either<ThreadAlreadyExists | ResourceNotFound, StartThreadOutput>> {
    const { openaiThreadId, userId } = startThreadInput.parse(input)

    const user = await db.select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))

    if (user.length === 0) {
        return makeLeft(new ResourceNotFound('Usuário não encontrado'))
    }

    const found = await db.select()
        .from(schema.threads)
        .where(eq(schema.threads.openaiThreadId, openaiThreadId))

    if (found.length > 0) {
        return makeLeft(new ThreadAlreadyExists())
    }

    const [thread] = await db.insert(schema.threads)
        .values({ openaiThreadId, userId })
        .returning()

    return makeRight({
        id: thread.id,
        title: 'Novo Chat',
        openaiThreadId: thread.openaiThreadId,
        createdAt: thread.createdAt.getTime(),
        messages: [],
    })
}
