import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const deleteUploadFileInput = z.object({
  userId: z.string(),
  uploadId: z.string(),
})
const deleteUploadFileOutput = z.null()

type DeleteUploadFileInput = z.infer<typeof deleteUploadFileInput>
type DeleteUploadFileOutput = z.infer<typeof deleteUploadFileOutput>

export async function deleteUploadFile(
  input: DeleteUploadFileInput
): Promise<Either<ResourceNotFound, DeleteUploadFileOutput>> {
  const { userId, uploadId } = deleteUploadFileInput.parse(input)

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (user.length === 0) {
    return makeLeft(new ResourceNotFound('User not found'))
  }

  const attachment = await db
    .select()
    .from(schema.attachments)
    .where(eq(schema.attachments.uploadId, uploadId))

  if (attachment.length > 0) {
    return makeLeft(new ResourceNotFound('File cannot be deleted because it is being used by an attachment'))
  }

  const deleted = await db
    .delete(schema.uploads)
    .where(eq(schema.uploads.id, uploadId))
    .returning()

  if (deleted.length === 0) {
    return makeLeft(new ResourceNotFound('File not found'))
  }

  return makeRight(null)
}
