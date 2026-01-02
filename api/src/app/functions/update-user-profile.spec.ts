import { isRight, unwrapEither } from '@/core/either'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { updateUserProfile } from './update-user-profile'

describe('update user profile', () => {
  it('should be able to update the user profile', async () => {
    const user = await makeUser()

    const sut = await updateUserProfile({
      userId: user.id,
      name: 'John Doe',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeNull()
  })

  it('should be able to update only the name', async () => {
    const user = await makeUser()

    const sut = await updateUserProfile({
      userId: user.id,
      name: 'John Doe',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeNull()
  })

  it('should not be able to update profile from non existing user', async () => {
    const sut = await updateUserProfile({
      userId: 'non-existing-user',
      name: 'John Doe',
    })

    expect(isRight(sut)).toBe(false)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
