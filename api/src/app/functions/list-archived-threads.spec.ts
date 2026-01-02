import { isRight, unwrapEither } from '@/core/either'
import { makeMessage } from '@/test/factories/make-message'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { type ListArchivedThreadsOutput, listArchivedThreads } from './list-archived-threads'

describe('list archived threads', () => {
    it('should be able to list archived threads with message count', async () => {
        const user = await makeUser()
        const thread = await makeThread({
            userId: user.id,
            archivedAt: new Date()
        })
        await makeMessage({ openaiThreadId: thread.openaiThreadId })
        await makeMessage({ openaiThreadId: thread.openaiThreadId })

        const result = await listArchivedThreads({ userId: user.id })

        expect(isRight(result)).toBe(true)
        const threads = unwrapEither(result) as ListArchivedThreadsOutput
        expect(threads).toHaveLength(1)
        expect(threads[0]).toEqual(
            expect.objectContaining({
                thread: expect.objectContaining({
                    openaiThreadId: thread.openaiThreadId,
                }),
                messagesAmount: 2
            })
        )
    })

    it('should return an empty array when no archived threads exist', async () => {
        const user = await makeUser()
        await makeThread({ userId: user.id })

        const result = await listArchivedThreads({ userId: user.id })

        expect(isRight(result)).toBe(true)
        const threads = unwrapEither(result) as ListArchivedThreadsOutput
        expect(threads).toHaveLength(0)
    })

    it('should only list archived threads', async () => {
        const user = await makeUser()
        const archivedThread = await makeThread({
            userId: user.id,
            archivedAt: new Date(),
        })
        await makeThread({
            userId: user.id,
        })

        await makeMessage({ openaiThreadId: archivedThread.openaiThreadId })

        const result = await listArchivedThreads({ userId: user.id })

        expect(isRight(result)).toBe(true)
        const threads = unwrapEither(result) as ListArchivedThreadsOutput
        expect(threads).toHaveLength(1)
        expect(threads[0].thread.openaiThreadId).toBe(archivedThread.openaiThreadId)
        expect(threads[0].messagesAmount).toBe(1)
    })
})
