import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeUpload(
  overrides: Partial<InferInsertModel<typeof schema.uploads>> = {}
) {
  const [upload] = await db
    .insert(schema.uploads)
    .values({
      userId: faker.string.uuid(),
      storage: faker.helpers.arrayElement(['openai']),
      fileId: faker.string.uuid(),
      createdAt: new Date(),
      bytes: faker.number.int({ min: 0, max: 1024 * 1024 * 2 }),
      filename: faker.system.fileName(),
      mimetype: faker.system.mimeType(),
      ...overrides,
    })
    .returning()

  return upload
}
