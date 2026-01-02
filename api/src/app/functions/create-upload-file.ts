import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const createUploadFileInput = z.object({
  userId: z.string(),
  storage: z.enum(['openai']),
  file: z.object({
    id: z.string(),
    bytes: z.number(),
    filename: z.string(),
    mimetype: z.string(),
  }),
})

const createUploadFileOutput = z.object({
  id: z.string(),
  userId: z.string(),
  storage: z.string(),
  file: z.object({
    id: z.string(),
    bytes: z.number(),
    filename: z.string(),
    mimetype: z.string(),
    createdAt: z.date(),
  }),
  createdAt: z.date(),
})

type CreateUploadFileInput = z.infer<typeof createUploadFileInput>
type CreateUploadFileOutput = z.infer<typeof createUploadFileOutput>

export async function createUploadFile(
  input: CreateUploadFileInput
): Promise<Either<ResourceNotFound, CreateUploadFileOutput>> {
  const { userId, storage, file } = createUploadFileInput.parse(input)

  const user = await db
    .select(getTableColumns(schema.users))
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (user.length === 0) {
    return makeLeft(new ResourceNotFound('Usuário não encontrado'))
  }

  // TODO: maybe later check if user can send new messages, because if he can't he should be able to upload files

  const [uploaded] = await db
    .insert(schema.uploads)
    .values({
      userId,
      storage,
      fileId: file.id,
      bytes: file.bytes,
      filename: file.filename,
      mimetype: file.mimetype,
    })
    .returning()

  return makeRight({
    id: uploaded.id,
    userId: uploaded.userId,
    storage: uploaded.storage,
    createdAt: uploaded.createdAt,
    file: {
      id: uploaded.fileId,
      bytes: uploaded.bytes,
      filename: uploaded.filename,
      mimetype: uploaded.mimetype,
      createdAt: uploaded.createdAt,
    },
  })
}
