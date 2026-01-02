import { db } from '@/db'
import { schema } from '@/db/schema'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAuthCode(
  overrides: Partial<InferInsertModel<typeof schema.authCodes>> &
    Pick<InferInsertModel<typeof schema.authCodes>, 'userId'>
) {
  const [authCode] = await db
    .insert(schema.authCodes)
    .values(overrides)
    .returning()

  return authCode
}
