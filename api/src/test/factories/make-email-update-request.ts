import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeEmailUpdateRequest(
  overrides: Partial<InferInsertModel<typeof schema.emailUpdateRequests>> &
    Pick<InferInsertModel<typeof schema.emailUpdateRequests>, 'subscriberId'>
) {
  const [emailUpdateRequest] = await db
    .insert(schema.emailUpdateRequests)
    .values({
      requestedEmail: faker.internet.email(),
      ...overrides,
    })
    .returning()

  return emailUpdateRequest
}
