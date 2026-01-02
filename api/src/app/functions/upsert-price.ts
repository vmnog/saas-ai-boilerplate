import { type Either, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

const upsertPriceInput = z.object({
  price: z.object({
    id: z.string(),
    product_id: z.string(),
    active: z.boolean(),
    currency: z.string(),
    type: z.string(),
    unit_amount: z.number().nullable(),
    interval: z.string().nullable(),
    interval_count: z.number().nullable(),
    trial_period_days: z.number().nullable(),
  }),
})

const upsertPriceOutput = z.object({
  id: z.string(),
  stripePriceId: z.string(),
  stripeProductId: z.string(),
  active: z.boolean(),
  currency: z.string(),
  type: z.string(),
  unitAmount: z.number().nullable(),
  interval: z.string().nullable(),
  intervalCount: z.number().nullable(),
  trialPeriodDays: z.number().nullable(),
})

type UpsertPriceInput = z.infer<typeof upsertPriceInput>
type UpsertPriceOutput = z.infer<typeof upsertPriceOutput>

export async function upsertPrice(
  input: UpsertPriceInput
): Promise<Either<never, UpsertPriceOutput>> {
  const { price } = upsertPriceInput.parse(input)

  const prices = await db
    .select(getTableColumns(schema.prices))
    .from(schema.prices)
    .where(eq(schema.prices.stripePriceId, price.id))

  if (prices.length === 0) {
    const [priceToUpsert] = await db
      .insert(schema.prices)
      .values({
        stripePriceId: price.id,
        stripeProductId: price.product_id,
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount,
        type: price.type,
        interval: price.interval,
        intervalCount: price.interval_count,
        trialPeriodDays: price.trial_period_days,
      })
      .returning()

    return makeRight({
      id: priceToUpsert.id,
      stripePriceId: priceToUpsert.stripePriceId,
      stripeProductId: priceToUpsert.stripeProductId,
      active: priceToUpsert.active,
      currency: priceToUpsert.currency,
      unitAmount: priceToUpsert.unitAmount,
      type: priceToUpsert.type,
      interval: priceToUpsert.interval,
      intervalCount: priceToUpsert.intervalCount,
      trialPeriodDays: priceToUpsert.trialPeriodDays,
    })
  }

  const [updatedPrice] = await db
    .update(schema.prices)
    .set({
      active: price.active,
      currency: price.currency,
      stripePriceId: price.id,
      stripeProductId: price.product_id,
      unitAmount: price.unit_amount,
      type: price.type,
      interval: price.interval,
      intervalCount: price.interval_count,
      trialPeriodDays: price.trial_period_days,
    })
    .where(eq(schema.prices.stripePriceId, price.id))
    .returning()

  return makeRight(updatedPrice)
}
