export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI feedback not configured on server' })
  }

  const { taskType, text } = req.body ?? {}

  // Input validation
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Missing text' })
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: 'Text too long (max 2000 characters)' })
  }
  if (!['writing', 'speaking'].includes(taskType)) {
    return res.status(400).json({ error: 'Invalid taskType' })
  }

  // Sanitize: strip HTML tags and control characters that could affect prompt structure
  const sanitized = text
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '')
    .slice(0, 2000)

  // Delimiters prevent injected content from escaping into instruction area
  const taskLabel = taskType === 'writing' ? 'written' : 'spoken'
  const userPrompt = `Give feedback on this English text ${taskLabel} by a Slovak learner:

<student_text>
${sanitized}
</student_text>

Respond only with valid JSON in this exact format:
{ "corrections": ["..."], "suggestions": ["..."], "praise": "..." }`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: `You are a friendly English teacher. Give short encouraging feedback.
Be concise — max 2 corrections, max 2 suggestions, 1 praise sentence.
corrections: specific grammar/spelling fixes (empty array if no errors).
suggestions: better word choices or phrases.
praise: one short motivating sentence.
Respond ONLY with the JSON object, no other text.`,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await response.json()
    const raw = data.content[0].text
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)[0])
    return res.status(200).json(json)
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
