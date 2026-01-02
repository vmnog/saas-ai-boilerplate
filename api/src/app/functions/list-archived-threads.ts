import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, count, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const listArchivedThreadsInput = z.object({
    userId: z.string(),
})

const listArchivedThreadsOutput =
    z.array(z.object({
        thread: z.object({
            id: z.string(),
            title: z.string().nullable(),
            openaiThreadId: z.string(),
            archivedAt: z.date().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
        messagesAmount: z.number(),
    }))

export type ListArchivedThreadsOutput = z.output<typeof listArchivedThreadsOutput>

export async function listArchivedThreads(input: z.infer<typeof listArchivedThreadsInput>): Promise<Either<ResourceNotFound, ListArchivedThreadsOutput>> {
    const { userId } = listArchivedThreadsInput.parse(input)

    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId))

    if (user.length === 0) {
        return makeLeft(new ResourceNotFound('Não foi possível encontrar o usuário'))
    }

    const result = await db
        .select({
            thread: {
                id: schema.threads.id,
                title: schema.threads.title,
                openaiThreadId: schema.threads.openaiThreadId,
                archivedAt: schema.threads.archivedAt,
                createdAt: schema.threads.createdAt,
                updatedAt: schema.threads.updatedAt,
            },
            messagesAmount: count(schema.messages.id),
        })
        .from(schema.threads)
        .leftJoin(schema.messages, eq(schema.threads.openaiThreadId, schema.messages.openaiThreadId))
        .where(and(eq(schema.threads.userId, userId), isNotNull(schema.threads.archivedAt), isNull(schema.threads.deletedAt)))
        .groupBy(schema.threads.id)
        .orderBy(desc(schema.threads.updatedAt))

    return makeRight(result)
}
