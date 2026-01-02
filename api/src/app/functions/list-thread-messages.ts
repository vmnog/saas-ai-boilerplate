import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { asc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'

const listThreadMessagesInput = z.object({
    openaiThreadId: z.string(),
    userId: z.string(),
})

const listThreadMessagesOutput = z.array(z.object({
    id: z.string(),
    text: z.string(),
    role: z.enum(['user', 'assistant']),
    createdAt: z.date(),
    openaiThreadId: z.string(),
    attachments: z.array(z.object({
        id: z.string(),
        filename: z.string(),
        mimetype: z.string(),
        createdAt: z.date(),
    })),
}))

type ListThreadMessagesInput = z.infer<typeof listThreadMessagesInput>
type ListThreadMessagesOutput = z.infer<typeof listThreadMessagesOutput>

export async function listThreadMessages(
    input: ListThreadMessagesInput
): Promise<Either<ResourceNotFound | NotAuthorized, ListThreadMessagesOutput>> {
    const { openaiThreadId, userId } = listThreadMessagesInput.parse(input)

    const thread = await db
        .select({
            id: schema.threads.id,
            userId: schema.threads.userId,
            archivedAt: schema.threads.archivedAt,
            deletedAt: schema.threads.deletedAt,
        })
        .from(schema.threads)
        .where(eq(schema.threads.openaiThreadId, openaiThreadId))
        .limit(1)

    if (!thread.length) {
        return makeLeft(new ResourceNotFound('Thread não encontrada.'))
    }

    if (thread[0].userId !== userId) {
        return makeLeft(
            new NotAuthorized(
                'Este usuário não tem permissão para acessar esta thread'
            )
        )
    }

    if (thread[0].archivedAt !== null) {
        return makeLeft(new NotAuthorized('Você não pode acessar uma thread arquivada.'))
    }

    if (thread[0].deletedAt !== null) {
        return makeLeft(new ResourceNotFound('Thread não encontrada.'))
    }

    const messages = await db
        .select({
            id: schema.messages.id,
            text: schema.messages.text,
            role: schema.messages.role,
            createdAt: schema.messages.createdAt,
            openaiThreadId: schema.messages.openaiThreadId,
            attachments: sql<
                {
                    id: string
                    filename: string
                    mimetype: string
                    createdAt: Date
                }[]
            > /*sql*/`
            COALESCE(
              JSON_AGG(
                CASE
                  WHEN ${schema.uploads.id} IS NOT NULL THEN
                    JSON_BUILD_OBJECT(
                      'id', ${schema.uploads.id},
                      'filename', ${schema.uploads.filename},
                      'mimetype', ${schema.uploads.mimetype},
                      'createdAt', ${schema.uploads.createdAt}
                    )
                  ELSE NULL
                END
              ) FILTER (WHERE ${schema.uploads.id} IS NOT NULL),
              '[]'::json
            ) AS attachments
          `,
        })
        .from(schema.messages)
        .leftJoin(schema.attachments, eq(schema.messages.id, schema.attachments.messageId))
        .leftJoin(schema.uploads, eq(schema.attachments.uploadId, schema.uploads.id))
        .where(eq(schema.messages.openaiThreadId, openaiThreadId))
        .groupBy(schema.messages.id)
        .orderBy(asc(schema.messages.createdAt))

    const mappedMessages = messages.map(message => ({
        ...message,
        createdAt: new Date(message.createdAt),
        attachments: message.attachments.map(attachment => ({
            ...attachment,
            createdAt: new Date(attachment.createdAt),
        })),
    }))

    return makeRight(mappedMessages)
}
