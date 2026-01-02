import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAssessmentMessage(
  overrides: Partial<InferInsertModel<typeof schema.assessmentMessages>> &
    Pick<
      InferInsertModel<typeof schema.assessmentMessages>,
      'assessmentId' | 'order' | 'answerType'
    >
) {
  const [result] = await db
    .insert(schema.assessmentMessages)
    .values({
      text: faker.lorem.paragraph(),
      ...overrides,
    })
    .returning()

  return result
}
