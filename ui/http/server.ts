'server only'

import { env } from '@/env'
import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'

function getBody<T>(c: Response | Request): Promise<T> {
  const contentType = c.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return c.json()
  }

  return c.text() as Promise<T>
}

async function getHeaders(headers?: HeadersInit): Promise<HeadersInit> {
  const token = getCookie('token', { cookies })

  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` }
  }

  return headers ?? {}
}

export async function http<T>(path: string, options: RequestInit): Promise<T> {
  try {
    const requestHeaders = await getHeaders(options.headers)

    const url = new URL(path, env.NEXT_PUBLIC_API_URL)

    const request = new Request(url, {
      ...options,
      headers: requestHeaders,
    })

    const response = await fetch(request)

    if (response.ok) {
      const data = await getBody<T>(response)
      return data as T
    }

    throw response
  } catch (error) {
    console.error('Error on server http:', error)
    // TODO: remove this temporary solution
    return undefined as T
    // redirect('/auth/sign-out?code=server-error')
  }
}
