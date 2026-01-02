import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAssessmentMessageChoice(
  overrides: Partial<InferInsertModel<typeof schema.assessmentMessageChoices>> &
    Pick<
      InferInsertModel<typeof schema.assessmentMessageChoices>,
      'assessmentMessageId' | 'order'
    >
) {
  const [result] = await db
    .insert(schema.assessmentMessageChoices)
    .values({
      text: faker.lorem.paragraph(),
      ...overrides,
    })
    .returning()

  return result
}
