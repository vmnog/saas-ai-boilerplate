import { db } from '@/db'
import { schema } from '@/db/schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeThread(
    overrides: Partial<InferInsertModel<typeof schema.threads>> = {}
) {
    const [thread] = await db
        .insert(schema.threads)
        .values({
            id: faker.string.uuid(),
            title: faker.lorem.words(3),
            openaiThreadId: faker.string.uuid(),
            userId: faker.string.uuid(),
            ...overrides,
        })
        .returning()

    return thread
}
