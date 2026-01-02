import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'
import { type DeleteThreadOutput, deleteThread } from './delete-thread'

describe('delete thread', () => {
  it('should be able to delete a thread', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })

    const sut = await deleteThread({
      openaiThreadId: thread.openaiThreadId,
      userId: user.id,
    })

    expect(isRight(sut)).toBe(true)
    const deletedThread = unwrapEither(sut) as DeleteThreadOutput
    expect(deletedThread).toEqual(
      expect.objectContaining({
        id: thread.id,
        deletedAt: expect.any(Date),
      })
    )
  })

  it('should not be able to delete a non-existing thread', async () => {
    const user = await makeUser()

    const sut = await deleteThread({
      openaiThreadId: 'non-existing-thread-id',
      userId: user.id,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete a thread from another user', async () => {
    const owner = await makeUser()
    const thread = await makeThread({ userId: owner.id })

    const anotherUser = await makeUser()

    const sut = await deleteThread({
      openaiThreadId: thread.openaiThreadId,
      userId: anotherUser.id,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotAuthorized)
  })
})
