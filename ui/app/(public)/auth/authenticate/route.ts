import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  console.debug('Received code:', code)

  if (!code) {
    console.debug('No code found, redirecting to /auth/sign-in')
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  try {
    console.debug('Sending authentication request to API')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      console.error('Authentication request failed with status:', response.status)
      throw new Error('Authentication failed')
    }

    const data = await response.json()
    const { token } = data

    console.debug('Authentication successful, received token:', token)

    // Set the token as an HTTP-only cookie
    cookies().set('token', token, {
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: '/',
    })

    console.debug('Token set in cookies, redirecting to /chat')
    // Redirect to the chat page
    return NextResponse.redirect(new URL('/chat', request.url))
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}