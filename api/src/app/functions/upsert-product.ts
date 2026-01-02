import { type Either, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

const upsertProductInput = z.object({
  product: z.object({
    stripeProductId: z.string(),
    active: z.boolean(),
    name: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    metadata: z.object({
      sendMessageLimit: z.number(),
      benefits: z.string(),
      shouldHighlight: z.boolean(),
    }),
  }),
});

const upsertProductOutput = z.object({
  id: z.string(),
  stripeProductId: z.string(),
  active: z.boolean(),
  name: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  metadata: z.object({
    sendMessageLimit: z.number(),
    benefits: z.string(),
    shouldHighlight: z.boolean(),
  }),
});

type UpsertProductInput = z.infer<typeof upsertProductInput>;
type UpsertProductOutput = z.infer<typeof upsertProductOutput>;

export async function upsertProduct(
  input: UpsertProductInput,
): Promise<Either<never, UpsertProductOutput>> {
  const { product } = upsertProductInput.parse(input);

  const products = await db
    .select(getTableColumns(schema.products))
    .from(schema.products)
    .where(eq(schema.products.stripeProductId, product.stripeProductId));

  if (products.length === 0) {
    const [productToUpsert] = await db
      .insert(schema.products)
      .values({
        stripeProductId: product.stripeProductId,
        active: product.active,
        name: product.name,
        description: product.description ?? null,
        image: product.image ?? null,
        metadata: {
          sendMessageLimit: product?.metadata.sendMessageLimit,
          benefits: product?.metadata.benefits,
          shouldHighlight: Boolean(product?.metadata.shouldHighlight),
        },
      })
      .returning();

    return makeRight({
      id: productToUpsert.id,
      stripeProductId: productToUpsert.stripeProductId,
      active: productToUpsert.active,
      name: productToUpsert.name,
      description: productToUpsert.description ?? null,
      image: productToUpsert.image ?? null,
      metadata: productToUpsert.metadata || {
        sendMessageLimit: 0,
        benefits: "Sem benefícios",
        shouldHighlight: false,
      },
    });
  }

  const [updatedProduct] = await db
    .update(schema.products)
    .set({
      stripeProductId: product.stripeProductId,
      active: product.active,
      name: product.name,
      description: product.description ?? null,
      image: product.image ?? null,
      metadata: {
        sendMessageLimit: product.metadata.sendMessageLimit,
        benefits: product.metadata.benefits,
        shouldHighlight: Boolean(product.metadata.shouldHighlight),
      },
    })
    .where(eq(schema.products.stripeProductId, product.stripeProductId))
    .returning();

  return makeRight({
    id: updatedProduct.id,
    stripeProductId: updatedProduct.stripeProductId,
    active: updatedProduct.active,
    name: updatedProduct.name,
    description: updatedProduct.description ?? null,
    image: updatedProduct.image ?? null,
    metadata: updatedProduct.metadata || {
      sendMessageLimit: 0,
      benefits: "",
      shouldHighlight: false,
    },
  });
}
