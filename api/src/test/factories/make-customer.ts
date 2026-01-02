import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeCustomer(
  overrides: Partial<InferInsertModel<typeof schema.customers>> = {}
) {
  const [customer] = await db
    .insert(schema.customers)
    .values({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      stripeCustomerId: faker.string.uuid(),
      ...overrides,
    })
    .returning()

  return customer
}
