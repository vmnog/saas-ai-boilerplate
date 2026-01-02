import { db } from "@/db";
import { schema } from "@/db/schema";
import { fakerPT_BR as faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

export async function makeProduct(
  overrides: Partial<InferInsertModel<typeof schema.products>> = {},
) {
  const [product] = await db
    .insert(schema.products)
    .values({
      stripeProductId: faker.string.uuid(),
      active: faker.datatype.boolean(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      metadata: {
        sendMessageLimit: faker.number.int({ min: 1, max: 1000 }),
        benefits: faker.lorem.paragraphs({ min: 1, max: 3 }),
        shouldHighLight: faker.datatype.boolean(),
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any,
      ...overrides,
    })
    .returning();

  return product;
}

