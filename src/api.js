export async function getFeedback(taskType, text) {
  if (!text.trim()) throw new Error('NO_TEXT')

  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ taskType, text: text.slice(0, 2000) }),
  })

  if (response.status === 503) throw new Error('NOT_CONFIGURED')
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'API_ERROR')
  }

  return response.json()
}
