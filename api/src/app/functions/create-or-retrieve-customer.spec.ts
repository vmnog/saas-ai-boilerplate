import { isRight, unwrapEither } from '@/core/either'
import { stripe } from '@/stripe/config'
import { makeCustomer } from '@/test/factories/make-customer'
import { makeUser } from '@/test/factories/make-user'
import { faker } from '@faker-js/faker'
import type Stripe from 'stripe'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { createOrRetrieveCustomer } from './create-or-retrieve-customer'

vi.mock('@/stripe/config', () => ({
  stripe: {
    customers: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
  },
}))

describe('create or retrieve customer', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should create a new customer when none exists', async () => {
    const user = await makeUser()

    const customerListData: Stripe.ApiList<Stripe.Customer> = {
      // @ts-ignore
      data: [{ id: faker.string.uuid() }],
    }
    // @ts-ignore
    const customerRetrieveData: Stripe.Customer = {
      id: faker.string.uuid(),
    }
    vi.mocked(stripe.customers.list).mockResolvedValueOnce(
      // @ts-ignore
      customerListData
    )
    vi.mocked(stripe.customers.retrieve).mockResolvedValueOnce(
      // @ts-ignore
      customerRetrieveData
    )

    const sut = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      stripeCustomerId: expect.any(String),
    })
  })

  it('should retrieve existing customer when one exists', async () => {
    const user = await makeUser()
    const customer = await makeCustomer({ userId: user.id })

    const sut = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      stripeCustomerId: customer.stripeCustomerId,
    })
  })

  it('should return error when user is not found', async () => {
    const input = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
    }

    const sut = await createOrRetrieveCustomer(input)

    expect(isRight(sut)).toBe(false)
    expect(unwrapEither(sut)).toEqual(new ResourceNotFound('User not found'))
  })
})
