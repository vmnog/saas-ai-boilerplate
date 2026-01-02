import { type Either, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { and, asc, eq, gt, isNotNull } from 'drizzle-orm'
import { z } from 'zod'
import type { ResourceNotFound } from '../errors/resource-not-found'

const listProductsInput = z.void()

const listProductsOutput = z.array(
  z.object({
    id: z.string(),
    stripeProductId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    active: z.boolean(),
    metadata: z
      .object({
        sendMessageLimit: z.number(),
        benefits: z.string(),
        shouldHighlight: z.boolean(),
        off: z.number(),
      })
      .nullable(),
    price: z
      .object({
        id: z.string(),
        stripePriceId: z.string(),
        type: z.string(),
        unitAmount: z.number().nullable(),
        trialPeriodDays: z.number().nullable(),
        interval: z.string().nullable(),
        intervalCount: z.number().nullable(),
      })
      .optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
)

export type ListProductsOutput = z.output<typeof listProductsOutput>

export async function listProducts(
  _input: z.infer<typeof listProductsInput>
): Promise<Either<ResourceNotFound, ListProductsOutput>> {
  const existingProducts = await db
    .select({
      id: schema.products.id,
      stripeProductId: schema.products.stripeProductId,
      name: schema.products.name,
      description: schema.products.description,
      active: schema.products.active,
      image: schema.products.image,
      metadata: schema.products.metadata,
      createdAt: schema.products.createdAt,
      updatedAt: schema.products.updatedAt,
      price: {
        id: schema.prices.id,
        stripePriceId: schema.prices.stripePriceId,
        type: schema.prices.type,
        trialPeriodDays: schema.prices.trialPeriodDays,
        unitAmount: schema.prices.unitAmount,
        interval: schema.prices.interval,
        intervalCount: schema.prices.intervalCount,
      },
    })
    .from(schema.products)
    .where(
      and(
        gt(schema.prices.unitAmount, 0),
        eq(schema.products.active, true),
        eq(schema.prices.active, true),
        isNotNull(schema.prices.trialPeriodDays)
      )
    )
    .innerJoin(
      schema.prices,
      eq(schema.products.stripeProductId, schema.prices.stripeProductId)
    )
    .orderBy(asc(schema.prices.unitAmount))

  const existingProductsTransformed = existingProducts.map(product => ({
    id: product.id,
    stripeProductId: product.stripeProductId,
    name: product.name,
    description: product.description,
    image: product.image,
    active: product.active,
    metadata: product.metadata
      ? {
        sendMessageLimit: Number(product.metadata.sendMessageLimit),
        benefits: product.metadata.benefits || '',
        shouldHighlight: product.metadata.shouldHighlight || false,
        off: Number(product.metadata.off),
      }
      : null,
    price: product.price,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }))

  const result = existingProductsTransformed

  return makeRight(result)
}
