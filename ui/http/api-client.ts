import { http } from './client'
import { API_ERROR_CODES } from './errors'
import type { Limits, Subscription, Thread, Upload } from './schemas'

export async function sendMessageToThread(
  openaiThreadId: string,
  message: {
    content: string
    attachments: {
      id: string
      fileId: string
    }[]
  }
) {
  try {
    const response = await http<Response>(
      `/threads/${openaiThreadId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      true
    )
    if (!response.ok) {
      const error = await response.json()
      console.error('Response error on sending message', error)
    }
    return response
  } catch (error) {
    console.error('Error sending message:', error)
    // Needs to handle error message like this because original error is a stream response
    // and it's not possible to get the error message from it, but we can get the error status and map it
    if (
      error instanceof Response &&
      error.status === API_ERROR_CODES.DAILY_MESSAGE_LIMIT_REACHED
    ) {
      throw new Error('Você atingiu o limite de mensagens enviadas para hoje')
    }
  }
}

export async function transcribeAudio(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const upload = await http<{ text: string }>('/audio/transcribe', {
    method: 'POST',
    body: formData,
  })
  return upload
}

export async function uploadAttachment(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const upload = await http<Upload>('/files/openai', {
    method: 'POST',
    body: formData,
  })
  return upload
}

export async function deleteUpload(uploadId: string) {
  const response = await http(`/files/${uploadId}`, {
    method: 'DELETE',
  })
  return response
}

export async function getThreadById(openaiThreadId: string) {
  const thread = await http<Thread>(`/threads/${openaiThreadId}`, {})
  return thread
}

export async function getLimits() {
  const limits = await http<Limits>('/users/me/limits', {})
  return limits
}

export async function getSubscription() {
  const subscription = await http<Subscription>('/users/me/subscription', {})
  return subscription
}

export async function registerFeedback(content: string, rating: string) {
  const response = await http<{ url: string }>('/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      rating,
    }),
  })
  return response
}
