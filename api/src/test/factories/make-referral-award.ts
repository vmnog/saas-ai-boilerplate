import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeReferralAward(
  overrides: Partial<InferInsertModel<typeof schema.referralAwards>> &
    Pick<InferInsertModel<typeof schema.referralAwards>, 'referralId'>
) {
  const [referralAward] = await db
    .insert(schema.referralAwards)
    .values({
      imageUrl: faker.image.urlLoremFlickr(),
      title: faker.lorem.words({ min: 4, max: 8 }),
      rule: 'count',
      ruleValue: faker.number.int({ min: 10, max: 300 }),
      ...overrides,
    })
    .returning()

  return referralAward
}
