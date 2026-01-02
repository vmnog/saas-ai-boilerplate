import { isRight, unwrapEither } from '@/core/either'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { upsertPrice } from './upsert-price'

describe('upsert price', () => {
  it('should be able to create a new price', async () => {
    const price = {
      id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      active: true,
      currency: 'usd',
      type: 'recurring',
      unit_amount: faker.number.int({ min: 100, max: 10000 }),
      interval: 'month',
      interval_count: 1,
      trial_period_days: 14,
    }

    const sut = await upsertPrice({ price })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      id: expect.any(String),
      stripePriceId: price.id,
      stripeProductId: price.product_id,
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: price.unit_amount,
      interval: price.interval,
      intervalCount: price.interval_count,
      trialPeriodDays: price.trial_period_days,
    })
  })

  it('should be able to update an existing price', async () => {
    const price = {
      id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      active: true,
      currency: 'usd',
      type: 'recurring',
      unit_amount: 1000,
      interval: 'month',
      interval_count: 1,
      trial_period_days: 14,
    }

    await upsertPrice({ price })
    const sut = await upsertPrice({
      price: { ...price, unit_amount: 2000 }
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      id: expect.any(String),
      stripePriceId: price.id,
      stripeProductId: price.product_id,
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: 2000,
      interval: price.interval,
      intervalCount: price.interval_count,
      trialPeriodDays: price.trial_period_days,
    })
  })
})
