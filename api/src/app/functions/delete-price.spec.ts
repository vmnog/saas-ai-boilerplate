import { isRight, unwrapEither } from '@/core/either'
import { makePrice } from '@/test/factories/make-price'
import { describe, expect, it } from 'vitest'
import { deletePrice } from './delete-price'

describe('delete price', () => {
  it('should be able to delete an existing price', async () => {
    const price = await makePrice()

    const sut = await deletePrice({ stripePriceId: price.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      id: price.id
    })
  })
})
