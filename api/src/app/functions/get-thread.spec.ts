import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { getThread } from './get-thread'

describe('get thread', () => {
  it('should be able to get thread details', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })

    const sut = await getThread({
      userId: user.id,
      openaiThreadId: thread.openaiThreadId,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(expect.objectContaining({
      id: thread.id,
      openaiThreadId: thread.openaiThreadId,
      userId: user.id,
    }))
  })

  it('should not be able to get non existing thread', async () => {
    const user = await makeUser()

    const sut = await getThread({
      userId: user.id,
      openaiThreadId: 'non-existing-thread',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
