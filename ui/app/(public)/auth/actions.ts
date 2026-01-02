import 'server-only'

import { dayjs } from '@/lib/dayjs'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

export function isAuthenticated() {
  const token = cookies().get('token')?.value

  console.debug('isAuthenticated: Retrieved token:', token)

  if (!token) {
    return false
  }

  const decoded = jwtDecode<{ sub: string; exp: number }>(token)
  const expiryDate = new Date(decoded.exp * 1000)
  const minutesUntilTokenExpires = dayjs(expiryDate).diff(new Date(), 'minutes')

  console.debug(
    'isAuthenticated: Token expires in',
    minutesUntilTokenExpires,
    'minutes'
  )

  if (minutesUntilTokenExpires < 15) {
    console.debug(
      'isAuthenticated: Token is about to expire, redirecting to sign-out'
    )
    return false
  }

  return !!cookies().get('token')?.value
}
