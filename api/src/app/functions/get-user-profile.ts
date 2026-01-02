import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ResourceNotFound } from '../errors/resource-not-found'

const getUserProfileInput = z.object({
  userId: z.string(),
})

const getUserProfileOutput = z.object({
  name: z.string().nullable(),
  email: z.string().email(),
})

type GetUserProfileInput = z.infer<typeof getUserProfileInput>
type GetUserProfileOutput = z.infer<typeof getUserProfileOutput>

export async function getUserProfile(
  input: GetUserProfileInput
): Promise<Either<ResourceNotFound, GetUserProfileOutput>> {
  const { userId } = getUserProfileInput.parse(input)

  const users = await db
    .select({
      name: schema.users.name,
      email: schema.users.email,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound('Usuário não encontrado.'))
  }

  const user = users[0]

  return makeRight({
    name: user.name,
    email: user.email,
  })
}
