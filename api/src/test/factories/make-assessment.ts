import { db } from '@/db'
import { schema } from '@/db/schema'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAssessment(
  overrides: Partial<InferInsertModel<typeof schema.assessments>> = {}
) {
  const [result] = await db
    .insert(schema.assessments)
    .values(overrides)
    .returning()

  return result
}
