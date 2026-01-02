import { z } from 'zod'
import { openai } from './client'

const deleteOpenAIFileInput = z.object({
    fileId: z.string(),
})

type DeleteOpenAIFileInput = z.infer<typeof deleteOpenAIFileInput>

export async function deleteOpenAIFile(input: DeleteOpenAIFileInput): Promise<void> {
    await openai.files.del(input.fileId)
}
