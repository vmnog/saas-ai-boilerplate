import { type Either, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const deletePriceInput = z.object({
  stripePriceId: z.string(),
})

const deletePriceOutput = z.object({
  id: z.string(),
})

type DeletePriceInput = z.infer<typeof deletePriceInput>
type DeletePriceOutput = z.infer<typeof deletePriceOutput>

export async function deletePrice(
  input: DeletePriceInput
): Promise<Either<never, DeletePriceOutput>> {
  const { stripePriceId: productPriceId } = deletePriceInput.parse(input)

  const [deletedPrice] = await db
    .delete(schema.prices)
    .where(eq(schema.prices.id, productPriceId))
    .returning()

  return makeRight({
    id: deletedPrice.id,
  })
}
