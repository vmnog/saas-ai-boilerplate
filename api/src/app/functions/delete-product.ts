import { type Either, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const deleteProductInput = z.object({
  productId: z.string()
})

const deleteProductOutput = z.object({
  id: z.string()
})

type DeleteProductInput = z.infer<typeof deleteProductInput>
type DeleteProductOutput = z.infer<typeof deleteProductOutput>

export async function deleteProduct(
  input: DeleteProductInput
): Promise<Either<never, DeleteProductOutput>> {
  const { productId } = deleteProductInput.parse(input)

  const [deletedProduct] = await db
    .delete(schema.products)
    .where(eq(schema.products.id, productId))
    .returning()

  return makeRight({
    id: deletedProduct.id
  })
}
