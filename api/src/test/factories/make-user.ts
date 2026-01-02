import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeUser(
  overrides: Partial<InferInsertModel<typeof schema.users>> = {}
) {
  const [user] = await db
    .insert(schema.users)
    .values({
      name: faker.person.fullName(),
      email: `${faker.string.uuid()}@${faker.string.uuid()}.com`,
      avatarUrl: faker.image.avatarGitHub(),
      ...overrides,
    })
    .returning()

  return user
}
