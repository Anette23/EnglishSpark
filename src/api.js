const FEEDBACK_TOKEN = import.meta.env.VITE_FEEDBACK_SECRET ?? ''

const CHAT_HEADERS = {
  'content-type': 'application/json',
  'x-feedback-token': FEEDBACK_TOKEN,
}

export async function sendChatMessage(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: CHAT_HEADERS,
    body: JSON.stringify({ messages, mode: 'message' }),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 503) throw new Error('NOT_CONFIGURED')
  if (!res.ok) throw new Error('API_ERROR')
  return res.json()
}

export async function getChatFeedback(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: CHAT_HEADERS,
    body: JSON.stringify({ messages, mode: 'feedback' }),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 503) throw new Error('NOT_CONFIGURED')
  if (!res.ok) throw new Error('API_ERROR')
  return res.json()
}

export async function getFeedback(taskType, text) {
  if (!text.trim()) throw new Error('NO_TEXT')

  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-feedback-token': FEEDBACK_TOKEN,
    },
    body: JSON.stringify({ taskType, text: text.slice(0, 2000) }),
  })

  if (response.status === 401) throw new Error('UNAUTHORIZED')
  if (response.status === 503) throw new Error('NOT_CONFIGURED')
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'API_ERROR')
  }

  return response.json()
}
