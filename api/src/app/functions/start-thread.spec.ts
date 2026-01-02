import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeUser } from '@/test/factories/make-user'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { ThreadAlreadyExists } from '../errors/thread-already-exists'
import { startThread } from './start-thread'

describe('start thread', () => {
    it('should be able to start a thread', async () => {
        const user = await makeUser()
        const openaiThreadId = faker.string.uuid()

        const sut = await startThread({
            userId: user.id,
            openaiThreadId,
        })

        expect(isRight(sut)).toBe(true)
        expect(unwrapEither(sut)).toEqual(
            expect.objectContaining({
                openaiThreadId,
                id: expect.any(String),
                title: 'Novo Chat',
                createdAt: expect.any(Number),
                messages: [],
            })
        )
    })

    it('should not be able to start a thread with a non-existent user', async () => {
        const sut = await startThread({
            userId: faker.string.uuid(),
            openaiThreadId: faker.string.uuid(),
        })

        expect(isLeft(sut)).toBe(true)
        expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
    })

    it('should not be able to start a thread with the same openaiThreadId twice', async () => {
        const user = await makeUser()
        const openaiThreadId = faker.string.uuid()

        const sut_1 = await startThread({
            userId: user.id,
            openaiThreadId,
        })
        const sut_2 = await startThread({
            userId: user.id,
            openaiThreadId,
        })

        expect(isRight(sut_1)).toBe(true)
        expect(isLeft(sut_2)).toBe(true)
        expect(unwrapEither(sut_2)).toBeInstanceOf(ThreadAlreadyExists)
    })
})
