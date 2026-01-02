import { isRight, unwrapEither } from '@/core/either'
import { makeMessage } from '@/test/factories/make-message'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { type ListThreadsOutput, listThreads } from './list-threads'

describe('list threads', () => {
    it('should be able to list threads with messages', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id })
        await makeMessage({ openaiThreadId: thread.openaiThreadId })
        await makeMessage({ openaiThreadId: thread.openaiThreadId })

        const result = await listThreads({ userId: user.id })

        expect(isRight(result)).toBe(true)
        const { threads } = unwrapEither(result) as ListThreadsOutput
        expect(threads).toHaveLength(1)
        expect(threads).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    openaiThreadId: thread.openaiThreadId,
                }),
                expect.objectContaining({
                    openaiThreadId: thread.openaiThreadId,
                }),
            ])
        )
    })

    it('should return an empty array for threads with no messages', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id })
        const result = await listThreads({ userId: thread.userId })

        expect(isRight(result)).toBe(true)
        const { threads } = unwrapEither(result) as ListThreadsOutput
        expect(threads).toHaveLength(1)
    })

    it('should not list archived threads', async () => {
        const user = await makeUser()
        const archivedThread = await makeThread({
            userId: user.id,
            archivedAt: new Date(),
        })
        const activeThread = await makeThread({
            userId: user.id,
        })

        await makeMessage({ openaiThreadId: archivedThread.openaiThreadId })
        await makeMessage({ openaiThreadId: activeThread.openaiThreadId })

        const result = await listThreads({ userId: user.id })

        expect(isRight(result)).toBe(true)
        const { threads } = unwrapEither(result) as ListThreadsOutput
        expect(threads).toHaveLength(1)
        expect(threads[0].openaiThreadId).toBe(activeThread.openaiThreadId)
    })
})
