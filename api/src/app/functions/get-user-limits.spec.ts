import { isRight, unwrapEither } from '@/core/either'
import { makeLimit } from '@/test/factories/make-limit'
import { makeNewSubscription } from '@/test/factories/make-new-subscription'
import { makePrice } from '@/test/factories/make-price'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { getUserLimits } from './get-user-limits'

describe('get user limits', () => {
  it('should be able to get the user limits', async () => {
    const user = await makeUser()
    const price = await makePrice()
    await makeNewSubscription({
      userId: user.id,
      priceId: price.id,
    })
    await makeLimit({
      userId: user.id,
    })

    const sut = await getUserLimits({
      userId: user.id,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      used: expect.any(Number),
      limit: expect.any(Number),
      resetAt: expect.any(Date),
    })
  })

  it('should not be able to get profile from non existing user', async () => {
    const sut = await getUserLimits({
      userId: 'non-existing-user',
    })

    expect(isRight(sut)).toBe(false)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
