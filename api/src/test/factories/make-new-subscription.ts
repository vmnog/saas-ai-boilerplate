import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeNewSubscription(
  overrides: Partial<InferInsertModel<typeof schema.newSubscriptions>>
) {
  const [subscription] = await db
    .insert(schema.newSubscriptions)
    .values({
      id: faker.string.uuid(),
      stripeSubscriptionId: faker.string.uuid(),
      userId: faker.string.uuid(),
      priceId: faker.string.uuid(),
      metadata: faker.helpers.arrayElement([null, {}]),
      status: faker.helpers.arrayElement([
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid',
        'paused',
      ]),
      quantity: faker.number.int({ min: 1, max: 5 }),
      cancelAtPeriodEnd: faker.datatype.boolean(),
      cancelAt: faker.helpers.arrayElement([null, faker.date.recent()]),
      canceledAt: faker.helpers.arrayElement([null, faker.date.recent()]),
      currentPeriodStart: faker.helpers.arrayElement([
        null,
        faker.date.recent(),
      ]),
      currentPeriodEnd: faker.helpers.arrayElement([
        null,
        faker.date.recent(),
      ]),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...overrides,
    })
    .returning()

  return subscription
}
