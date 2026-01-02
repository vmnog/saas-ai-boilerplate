import { cookies } from 'next/dist/client/components/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  cookies().delete('token')

  // Get the redirect URL from the query parameters or use a default
  const redirectTo =
    request.nextUrl.searchParams.get('redirect_to') || '/auth/sign-in'

  // Create a new URL for redirection
  const redirectUrl = new URL(redirectTo, request.url)

  // Handle error codes from a list and add to the redirect URL if present
  const errorCodes = ['jwt-expired', 'no-token', 'server-error']
  const errorCode = request.nextUrl.searchParams.get('code')
  if (errorCode && errorCodes.includes(errorCode)) {
    redirectUrl.searchParams.set('code', errorCode)
  }

  // Redirect the user
  return NextResponse.redirect(redirectUrl)
}
