import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeAttachment(
  overrides: Partial<InferInsertModel<typeof schema.attachments>> = {}
) {
  const [attachment] = await db
    .insert(schema.attachments)
    .values({
      messageId: faker.string.uuid(),
      uploadId: faker.string.uuid(),
      ...overrides,
    })
    .returning()

  return attachment
}
