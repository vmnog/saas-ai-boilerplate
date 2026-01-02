import { z } from 'zod'
import { openai } from './client'


const createOpenAIThreadInput = z.void()
const createOpenAIThreadOutput = z.object({
    thread: z.object({
        id: z.string(),
        created_at: z.number(),
        metadata: z.unknown().nullable(),
        object: z.literal('thread'),
        tool_resources: z.object({
            code_interpreter: z.object({
                file_ids: z.array(z.string()).optional(),
            }).optional(),
            file_search: z.object({
                vector_store_ids: z.array(z.string()).optional(),
            }).optional(),
        }).nullable(),
    }),
})

type CreateOpenAIThreadInput = z.infer<typeof createOpenAIThreadInput>
type CreateOpenAIThreadOutput = z.infer<typeof createOpenAIThreadOutput>

export async function createOpenAIThread(_input: CreateOpenAIThreadInput): Promise<CreateOpenAIThreadOutput> {
    const thread = await openai.beta.threads.create()

    return { thread }
}
