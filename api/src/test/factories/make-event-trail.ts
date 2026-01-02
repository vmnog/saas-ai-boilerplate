import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeEventTrail(
  overrides: Partial<InferInsertModel<typeof schema.eventTrails>> &
    Pick<InferInsertModel<typeof schema.eventTrails>, 'eventId'>
) {
  const [eventTrail] = await db
    .insert(schema.eventTrails)
    .values({
      title: faker.lorem.words(5),
      ...overrides,
    })
    .returning()

  return eventTrail
}
