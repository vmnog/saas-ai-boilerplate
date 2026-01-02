import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeReferral(
  overrides: Partial<InferInsertModel<typeof schema.referrals>> &
    Pick<InferInsertModel<typeof schema.referrals>, 'eventId'>
) {
  const [referral] = await db
    .insert(schema.referrals)
    .values({
      termsUrl: faker.internet.url(),
      ticketThemeHex: faker.color.rgb(),
      ticketStartNumber: faker.number.int({
        min: 5000,
        max: 20000,
      }),
      ...overrides,
    })
    .returning()

  return referral
}
