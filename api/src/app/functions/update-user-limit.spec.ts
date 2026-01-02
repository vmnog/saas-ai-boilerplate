import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeLimit } from '@/test/factories/make-limit'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { updateUserLimit } from './update-user-limit'

describe('update user limit', () => {
  it('should be able to increment message usage count', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 5,
    })

    const sut = await updateUserLimit({
      userId: user.id,
      type: 'send-message',
      amount: 1,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        sendMessageUsed: 6,
      })
    )
  })

  it('should be able to decrement message usage count', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 5,
    })

    const sut = await updateUserLimit({
      userId: user.id,
      type: 'send-message',
      amount: -1,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        sendMessageUsed: 4,
      })
    )
  })

  it('should set reset date when exceeding limit', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 9,
    })

    const sut = await updateUserLimit({
      userId: user.id,
      type: 'send-message',
      amount: 1,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        sendMessageLimit: 10,
        sendMessageUsed: 10,
        sendMessageLimitResetAt: expect.any(Date),
      })
    )
  })

  it('should not be able to update limit of non existing user', async () => {
    const user = await makeUser()

    const sut = await updateUserLimit({
      userId: user.id,
      type: 'send-message',
      amount: 1,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
