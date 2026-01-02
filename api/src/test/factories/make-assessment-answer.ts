import { db } from '@/db'
import { schema } from '@/db/schema'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAssessmentAnswer(
  overrides: Partial<InferInsertModel<typeof schema.assessmentAnswers>> &
    Pick<
      InferInsertModel<typeof schema.assessmentAnswers>,
      'assessmentMessageId' | 'subscriberId'
    >
) {
  const [result] = await db
    .insert(schema.assessmentAnswers)
    .values(overrides)
    .returning()

  return result
}
