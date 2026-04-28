import { useState, useRef, useEffect } from 'react'
import FeedbackView from './FeedbackView'
import { sendChatMessage, getChatFeedback } from '../api'

const STARTERS = [
  "What did you do last weekend?",
  "Tell me something interesting about Slovakia.",
  "What are your plans for the next few months?",
  "What's a hobby you'd like to try?",
  "Describe your favourite place to relax.",
]

function getStarter() {
  return STARTERS[Math.floor(Math.random() * STARTERS.length)]
}

export default function ChatSession({ onBack }) {
  const [messages, setMessages]       = useState([
    { role: 'assistant', content: getStarter() },
  ])
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [feedback, setFeedback]       = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showFeedback])

  const userMessages = messages.filter(m => m.role === 'user')
  const canGetFeedback = userMessages.length >= 2

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const { reply } = await sendChatMessage(newMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      if (e.message === 'NOT_CONFIGURED') {
        setError('AI is not set up yet. See ⚙️ Settings.')
      } else if (e.message === 'UNAUTHORIZED') {
        setError('Token error. Try redeploying the app.')
      } else {
        setError('Could not reach AI. Check your connection.')
      }
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleFeedback() {
    setShowFeedback(true)
    setFeedbackLoading(true)
    try {
      const result = await getChatFeedback(messages)
      setFeedback(result)
    } catch {
      setFeedback(null)
    } finally {
      setFeedbackLoading(false)
    }
  }

  return (
    <div className="chat-session">
      <div className="chat-topbar">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="chat-title">
          <span>💬</span> English Chat
        </div>
        {canGetFeedback && !showFeedback && (
          <button className="btn-feedback-chat" onClick={handleFeedback}>
            Get feedback
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
            {m.role === 'assistant' && <div className="bubble-avatar">🤖</div>}
            <div className="bubble-text">{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bubble-ai">
            <div className="bubble-avatar">🤖</div>
            <div className="bubble-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {error && <p className="chat-error">{error}</p>}

        {showFeedback && (
          <div className="chat-feedback-section">
            <div className="chat-feedback-label">📝 Conversation Feedback</div>
            <FeedbackView feedback={feedback} loading={feedbackLoading} error={null} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!showFeedback && (
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Write in English..."
            value={input}
            rows={2}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={loading}
            maxLength={500}
          />
          <button
            className="btn-send"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            type="button"
          >
            ➤
          </button>
        </div>
      )}

      {showFeedback && !feedbackLoading && (
        <button className="btn-primary" style={{ margin: '0 16px 24px' }} onClick={onBack}>
          Back to Dashboard
        </button>
      )}

      {!showFeedback && canGetFeedback && (
        <p className="chat-hint">Tip: Send a few more messages, then tap "Get feedback" to see corrections.</p>
      )}
    </div>
  )
}
