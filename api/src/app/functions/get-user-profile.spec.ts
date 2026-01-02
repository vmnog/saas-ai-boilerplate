import { isRight, unwrapEither } from '@/core/either'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { getUserProfile } from './get-user-profile'

describe('get user profile', () => {
  it('should be able to get the user profile', async () => {
    const user = await makeUser()

    const sut = await getUserProfile({
      userId: user.id,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      name: user.name,
      email: user.email,
    })
  })

  it('should not be able to get profile from non existing user', async () => {
    const sut = await getUserProfile({
      userId: 'non-existing-user',
    })

    expect(isRight(sut)).toBe(false)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
