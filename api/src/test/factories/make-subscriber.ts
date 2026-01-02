import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeSubscriber(
  overrides: Partial<InferInsertModel<typeof schema.subscribers>> &
    Pick<InferInsertModel<typeof schema.subscribers>, 'eventId'>
) {
  const [subscriber] = await db
    .insert(schema.subscribers)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      ...overrides,
    })
    .returning()

  return subscriber
}
