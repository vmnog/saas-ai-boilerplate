import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const updateUserProfileInput = z.object({
  userId: z.string(),
  name: z.string(),
})

type UpdateUserProfileInput = z.infer<typeof updateUserProfileInput>

export async function updateUserProfile(
  input: UpdateUserProfileInput
): Promise<Either<ResourceNotFound, null>> {
  const { userId, name } = updateUserProfileInput.parse(input)

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound('Usuário não encontrado.'))
  }

  await db
    .update(schema.users)
    .set({
      name,
    })
    .where(eq(schema.users.id, userId))

  return makeRight(null)
}
