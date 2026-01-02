import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeEventTicketNumber(
  overrides: Partial<InferInsertModel<typeof schema.eventTicketNumber>> &
    Pick<InferInsertModel<typeof schema.eventTicketNumber>, 'eventId'>
) {
  const [eventTicketNumber] = await db
    .insert(schema.eventTicketNumber)
    .values({
      lastTicketNumber: faker.number.int({ min: 20_000, max: 40_000 }),
      ...overrides,
    })
    .returning()

  return eventTicketNumber
}
