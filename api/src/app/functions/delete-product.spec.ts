import { isRight, unwrapEither } from '@/core/either'
import { makeProduct } from '@/test/factories/make-product'
import { describe, expect, it } from 'vitest'
import { deleteProduct } from './delete-product'

describe('delete product', () => {
  it('should be able to delete an existing product', async () => {
    const product = await makeProduct()

    const sut = await deleteProduct({ productId: product.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      id: product.id
    })
  })
})
