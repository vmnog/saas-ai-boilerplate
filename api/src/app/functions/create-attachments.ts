import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const createAttachmentsInput = z.object({
  messageId: z.string(),
  uploads: z.array(z.object({
    id: z.string(),
    fileId: z.string(),
  })),
})

const createAttachmentsOutput = z.array(z.object({
  id: z.string(),
  createdAt: z.date(),
  uploadId: z.string().nullable(),
  messageId: z.string().nullable(),
}))

type CreateAttachmentsInput = z.infer<typeof createAttachmentsInput>
type CreateAttachmentsOutput = z.infer<typeof createAttachmentsOutput>

export async function createAttachments(
  input: CreateAttachmentsInput
): Promise<Either<ResourceNotFound, CreateAttachmentsOutput>> {
  const { messageId, uploads } = createAttachmentsInput.parse(input)

  const message = await db
    .select(getTableColumns(schema.messages))
    .from(schema.messages)
    .where(eq(schema.messages.id, messageId))

  if (message.length === 0) {
    return makeLeft(new ResourceNotFound('Message not found'))
  }

  const createdAttachments = []

  for (const upload of uploads) {
    const existingUpload = await db
      .select(getTableColumns(schema.uploads))
      .from(schema.uploads)
      .where(eq(schema.uploads.id, upload.id))

    if (existingUpload.length === 0) {
      return makeLeft(new ResourceNotFound(`Upload with id ${upload.id} not found`))
    }

    const existingAttachment = await db
      .select(getTableColumns(schema.attachments))
      .from(schema.attachments)
      .where(
        and(
          eq(schema.attachments.messageId, messageId),
          eq(schema.attachments.uploadId, upload.id)
        )
      )

    if (existingAttachment.length === 0) {
      const [createdAttachment] = await db
        .insert(schema.attachments)
        .values({
          messageId,
          uploadId: upload.id,
        }).returning()

      createdAttachments.push(createdAttachment)
    }
  }

  return makeRight(createdAttachments)
}
