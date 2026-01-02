import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const getUploadByIdInput = z.object({
  userId: z.string(),
  uploadId: z.string(),
})
const getUploadByIdOutput = z.object({
  id: z.string(),
  userId: z.string(),
  fileId: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  bytes: z.number(),
  createdAt: z.date(),
})

type GetUploadByIdInput = z.infer<typeof getUploadByIdInput>
type GetUploadByIdOutput = z.infer<typeof getUploadByIdOutput>

export async function getUploadById(
  input: GetUploadByIdInput
): Promise<Either<ResourceNotFound, GetUploadByIdOutput>> {
  const { userId, uploadId } = getUploadByIdInput.parse(input)

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (user.length === 0) {
    return makeLeft(new ResourceNotFound('User not found'))
  }

  const upload = await db
    .select()
    .from(schema.uploads)
    .where(eq(schema.uploads.id, uploadId))
    .limit(1)

  if (upload.length === 0) {
    return makeLeft(new ResourceNotFound('Upload not found'))
  }

  return makeRight(upload[0])
}
