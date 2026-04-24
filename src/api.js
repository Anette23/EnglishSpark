const API_KEY_STORAGE = 'anthropic_api_key'

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || ''
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim())
}

export async function getFeedback(taskType, text) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_KEY')
  if (!text.trim()) throw new Error('NO_TEXT')

  const systemPrompt = `You are a friendly English teacher giving short, encouraging feedback to a Slovak learner practicing daily English.
Be concise — max 4 bullet points. Use simple language. Always end with one short motivating sentence.
Format your response as JSON: { "corrections": ["..."], "suggestions": ["..."], "praise": "..." }
- corrections: specific grammar/spelling fixes (max 2, only real errors)
- suggestions: better word choices or phrases (max 2)
- praise: one short motivating sentence`

  const userPrompt = taskType === 'writing'
    ? `Here is what the student wrote in English. Give feedback:\n\n"${text}"`
    : `Here is what the student said/wrote during their speaking practice. Give feedback:\n\n"${text}"`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    if (response.status === 401) throw new Error('INVALID_KEY')
    throw new Error(err.error?.message || 'API_ERROR')
  }

  const data = await response.json()
  const raw = data.content[0].text
  const json = JSON.parse(raw.match(/\{[\s\S]*\}/)[0])
  return json
}
