import { db } from "@/db";
import { schema } from "@/db/schema";
import { fakerPT_BR as faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

export async function makeMessage(
  overrides: Partial<InferInsertModel<typeof schema.messages>> = {},
) {
  const [message] = await db
    .insert(schema.messages)
    .values({
      openaiMessageId: faker.string.uuid(),
      openaiThreadId: faker.string.uuid(),
      role: faker.helpers.arrayElement(["user", "assistant"]),
      text: faker.lorem.paragraph(),
      createdAt: faker.date.recent(),
      usage: {
        prompt_tokens: faker.number.int(),
        completion_tokens: faker.number.int(),
        total_tokens: faker.number.int(),
        prompt_token_details: { cached_tokens: faker.number.int() },
      },
      ...overrides,
    })
    .returning();

  return message;
}
