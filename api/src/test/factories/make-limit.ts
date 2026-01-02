import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLimit(
  overrides: Partial<InferInsertModel<typeof schema.limits>> &
    Pick<InferInsertModel<typeof schema.limits>, 'userId'>
) {
  const [limit] = await db
    .insert(schema.limits)
    .values({
      sendMessageLimit: faker.number.int({ min: 10, max: 100 }),
      sendMessageUsed: 0,
      sendMessageLimitResetAt: faker.date.future(),
      ...overrides,
    })
    .returning()

  return limit
}
