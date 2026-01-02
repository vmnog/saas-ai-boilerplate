import { isLeft, isRight, unwrapEither } from '@/core/either'
import { sendAuthMagicLink } from '@/mail/messages/send-auth-magic-link'
import { makeUser } from '@/test/factories/make-user'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { sendAuthenticationLink } from './send-authentication-link'

describe('send authentication link', () => {
  beforeAll(() => {
    vi.mock('@/mail/messages/send-auth-magic-link', () => {
      return {
        sendAuthMagicLink: vi.fn(),
      }
    })
  })

  it('should be able to send authentication link when user exists', async () => {
    const user = await makeUser()

    const sut = await sendAuthenticationLink({
      email: user.email,
    })

    expect(isRight(sut)).toBe(true)
    expect(sendAuthMagicLink).toBeCalled()
  })

  it('should not be able to send authentication link when user does not exists', async () => {
    const sut = await sendAuthenticationLink({
      email: 'inexistent-user@example.com',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
