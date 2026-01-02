import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeEvent(
  overrides: Partial<InferInsertModel<typeof schema.events>> &
    Pick<InferInsertModel<typeof schema.events>, 'organizationId'>
) {
  const [event] = await db
    .insert(schema.events)
    .values({
      subscriptionUrl: faker.internet.url(),
      title: faker.lorem.words(3),
      slug: faker.lorem.slug(3),
      ...overrides,
    })
    .returning()

  return event
}
