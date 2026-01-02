import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeAuthCode } from '@/test/factories/make-auth-code'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { ExpiredAuthenticationCode } from '../errors/expired-authentication-code'
import { authenticateFromCode } from './authenticate-from-code'
import { ResourceNotFound } from '../errors/resource-not-found'
import { makeUser } from '@/test/factories/make-user'

describe('authenticate from code', () => {
  it('should be able to authenticate user from auth code', async () => {
    const user = await makeUser()
    const authCode = await makeAuthCode({ userId: user.id })

    const sut = await authenticateFromCode({ code: authCode.code })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with invalid auth code', async () => {
    const sut = await authenticateFromCode({
      code: 'invalid-auth-code',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to authenticate with expired auth code', async () => {
    const user = await makeUser()
    const authCode = await makeAuthCode({
      userId: user.id,
      createdAt: dayjs().subtract(1, 'day').subtract(1, 'minute').toDate(),
    })

    const sut = await authenticateFromCode({
      code: authCode.code,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ExpiredAuthenticationCode)
  })
})
