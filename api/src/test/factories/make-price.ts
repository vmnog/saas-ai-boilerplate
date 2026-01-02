import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makePrice(
  overrides: Partial<InferInsertModel<typeof schema.prices>> = {}
) {
  const [price] = await db
    .insert(schema.prices)
    .values({
      id: faker.string.uuid(),
      stripePriceId: faker.string.uuid(),
      stripeProductId: faker.string.uuid(),
      active: faker.datatype.boolean(),
      currency: faker.finance.currencyCode(),
      type: faker.helpers.arrayElement(['one_time', 'recurring']),
      unitAmount: faker.number.int({ min: 1000, max: 100000 }),
      interval: faker.helpers.arrayElement(['day', 'week', 'month', 'year']),
      intervalCount: faker.number.int({ min: 1, max: 12 }),
      trialPeriodDays: faker.number.int({ min: 0, max: 30 }),
      ...overrides,
    })
    .returning()

  return price
}
