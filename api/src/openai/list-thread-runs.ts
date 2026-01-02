import { z } from 'zod'
import { openai } from './client'
import type { Run } from 'openai/resources/beta/threads/runs/runs'

const listThreadRunsInput = z.object({
    threadId: z.string()
})

const listThreadRunsOutput = z.object({
    runs: z.array(z.custom<Run>())
})

type ListThreadRunsInput = z.infer<typeof listThreadRunsInput>
type ListThreadRunsOutput = z.infer<typeof listThreadRunsOutput>

export async function listThreadRuns(input: ListThreadRunsInput): Promise<ListThreadRunsOutput> {
    const runs = await openai.beta.threads.runs.list(input.threadId)

    return {
        runs: runs.data
    }
}
