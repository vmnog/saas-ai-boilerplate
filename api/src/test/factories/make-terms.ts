import { db } from "@/db";
import { schema } from "@/db/schema";
import { fakerPT_BR as faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

export async function makeTerms(
  overrides: Partial<InferInsertModel<typeof schema.terms>> = {},
) {
  const [terms] = await db
    .insert(schema.terms)
    .values({
      userId: faker.string.uuid(),
      termsOfUse: faker.helpers.arrayElement([true, false]),
      privacyPolicy: faker.helpers.arrayElement([true, false]),
      ...overrides,
    })
    .returning();

  return terms;
}
