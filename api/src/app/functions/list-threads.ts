import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, desc, eq, getTableColumns, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const listThreadsInput = z.object({
    userId: z.string(),
})

const listThreadsOutput = z.object({
    threads: z.array(z.object({
        id: z.string(),
        title: z.string().nullable(),
        openaiThreadId: z.string(),
        archivedAt: z.date().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })),
})

export type ListThreadsOutput = z.output<typeof listThreadsOutput>

export async function listThreads(input: z.infer<typeof listThreadsInput>): Promise<Either<unknown, ListThreadsOutput>> {
    const { userId } = listThreadsInput.parse(input)

    try {
        const user = await db.select().from(schema.users).where(eq(schema.users.id, userId))

        if (user.length === 0) {
            return makeLeft(new ResourceNotFound('Não foi possível encontrar o usuário'))
        }

        const result = await db
            .select(getTableColumns(schema.threads))
            .from(schema.threads)
            .where(and(eq(schema.threads.userId, userId), isNull(schema.threads.archivedAt), isNull(schema.threads.deletedAt)))
            .orderBy(desc(schema.threads.updatedAt))

        return makeRight({ threads: result })
    } catch (error) {
        return makeLeft(error)
    }
}
