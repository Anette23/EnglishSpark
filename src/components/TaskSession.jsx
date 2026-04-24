import { useState } from 'react'
import Timer from './Timer'
import FeedbackView from './FeedbackView'
import { getDailyPrompt, WRITING_PROMPTS, SPEAKING_PROMPTS } from '../prompts'
import { formatDuration } from '../habitStore'
import { getFeedback, getApiKey } from '../api'

export default function TaskSession({ taskType, duration, onComplete, onBack }) {
  const [text, setText] = useState('')
  const [speakingNotes, setSpeakingNotes] = useState('')
  const [timerDone, setTimerDone] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  const isWriting = taskType === 'writing'
  const prompt = getDailyPrompt(isWriting ? WRITING_PROMPTS : SPEAKING_PROMPTS)
  const icon = isWriting ? '✍️' : '🎤'
  const accentColor = isWriting ? 'accent-purple' : 'accent-green'
  const hasApiKey = !!getApiKey()

  const feedbackText = isWriting ? text : speakingNotes

  async function handleSubmit() {
    setSubmitted(true)
    onComplete()

    if (hasApiKey && feedbackText.trim()) {
      setFeedbackLoading(true)
      setFeedbackError(null)
      try {
        const result = await getFeedback(taskType, feedbackText)
        setFeedback(result)
      } catch (e) {
        if (e.message === 'NO_KEY') {
          setFeedbackError('Add your API key in Settings to get feedback.')
        } else if (e.message === 'INVALID_KEY') {
          setFeedbackError('Invalid API key. Check your key in Settings.')
        } else {
          setFeedbackError('Could not load feedback. Try again later.')
        }
      } finally {
        setFeedbackLoading(false)
      }
    }
  }

  if (submitted) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete-inline">
          <div className="complete-icon">⭐</div>
          <h2>Amazing work!</h2>
          <p className="xp-gain">+25 XP earned</p>
        </div>

        {(feedbackLoading || feedback || feedbackError) && (
          <FeedbackView
            feedback={feedback}
            loading={feedbackLoading}
            error={feedbackError}
            taskType={taskType}
          />
        )}

        {!hasApiKey && (
          <div className="feedback-box feedback-hint">
            💡 Add an Anthropic API key in <strong>Settings</strong> to get AI feedback on your English.
          </div>
        )}

        {!feedbackLoading && (
          <button className="btn-primary" onClick={onBack}>Back to Dashboard</button>
        )}
      </div>
    )
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className={`task-header ${accentColor}`}>
        <span className="task-icon">{icon}</span>
        <div>
          <h2>{isWriting ? 'Writing' : 'Speaking'} Session</h2>
          <p className="task-subtitle">{formatDuration(duration)} challenge</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Today's prompt</div>
        <p className="prompt-text">"{prompt}"</p>
      </div>

      <Timer
        duration={duration}
        taskType={taskType}
        onComplete={() => setTimerDone(true)}
      />

      {isWriting && (
        <div className="writing-area">
          <textarea
            placeholder="Start writing here... don't worry about mistakes, just write!"
            value={text}
            onChange={e => setText(e.target.value)}
            className="text-input"
            rows={6}
          />
        </div>
      )}

      {!isWriting && (
        <>
          <div className="speaking-hint">
            <p>🎤 Speak out loud for {formatDuration(duration)}.</p>
            <p>No recording needed — just talk! Use a mirror, record on your phone, or simply speak to yourself.</p>
          </div>
          {timerDone && (
            <div className="writing-area">
              <label className="input-label">What did you say? <span className="optional">(optional, for AI feedback)</span></label>
              <textarea
                placeholder="Write a few sentences you said out loud..."
                value={speakingNotes}
                onChange={e => setSpeakingNotes(e.target.value)}
                className="text-input"
                rows={4}
              />
            </div>
          )}
        </>
      )}

      {timerDone && (
        <button className="btn-primary btn-done" onClick={handleSubmit}>
          {feedbackText.trim() && hasApiKey ? 'Submit & Get Feedback ✓' : 'Mark as Done ✓'}
        </button>
      )}
    </div>
  )
}
