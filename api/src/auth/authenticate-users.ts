import { env } from '@/env'
import { SignJWT } from 'jose'

export async function authenticateUsers({
  userId,
}: { userId: string }) {
  const secret = new TextEncoder().encode(env.USER_JWT_SECRET)

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject(userId)
    .setExpirationTime('7d')
    .sign(secret)

  return { token }
}
