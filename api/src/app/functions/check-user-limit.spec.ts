import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeLimit } from '@/test/factories/make-limit'
import { makeUser } from '@/test/factories/make-user'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { checkUserLimit } from './check-user-limit'

describe('check user limit', () => {
  it('should be able to check if user can send message when under limit', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 5,
    })

    const sut = await checkUserLimit({
      userId: user.id,
      type: 'send-message',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        allowed: true,
      })
    )
  })

  it('should not be able to send message when over limit', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 10,
    })

    const sut = await checkUserLimit({
      userId: user.id,
      type: 'send-message',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        allowed: false,
      })
    )
  })

  it('should not be able to check limit of non existing user', async () => {
    const user = await makeUser()

    const sut = await checkUserLimit({
      userId: user.id,
      type: 'send-message',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should reset limit when reset at is in the past', async () => {
    const user = await makeUser()
    await makeLimit({
      userId: user.id,
      sendMessageLimit: 10,
      sendMessageUsed: 10,
      sendMessageLimitResetAt: dayjs().subtract(1, 'hour').toDate(),
    })

    const sut = await checkUserLimit({
      userId: user.id,
      type: 'send-message',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        allowed: true,
      })
    )
  })
})
