import { useState } from 'react'
import Timer from './Timer'
import FeedbackView from './FeedbackView'
import { getDailyPrompt, WRITING_PROMPTS, SPEAKING_PROMPTS } from '../prompts'
import { formatDuration } from '../habitStore'
import { getFeedback } from '../api'

const MAX_LENGTH = 2000

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
  const feedbackText = isWriting ? text : speakingNotes

  async function handleSubmit() {
    setSubmitted(true)
    onComplete()

    if (feedbackText.trim()) {
      setFeedbackLoading(true)
      setFeedbackError(null)
      try {
        const result = await getFeedback(taskType, feedbackText)
        setFeedback(result)
      } catch (e) {
        if (e.message === 'NOT_CONFIGURED') {
          setFeedbackError('AI feedback is not set up yet. See ⚙️ Settings for instructions.')
        } else if (e.message === 'UNAUTHORIZED') {
          setFeedbackError('Feedback token mismatch. Try redeploying the app.')
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

        {feedbackText.trim()
          ? <FeedbackView feedback={feedback} loading={feedbackLoading} error={feedbackError} />
          : <div className="feedback-box feedback-hint">💡 Next time write something to get AI feedback on your English.</div>
        }

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
            maxLength={MAX_LENGTH}
          />
          <div className="char-count">{text.length} / {MAX_LENGTH}</div>
        </div>
      )}

      {!isWriting && (
        <>
          <div className="speaking-hint">
            <p>🎤 Speak out loud for {formatDuration(duration)}.</p>
            <p>No recording needed — just talk! Use a mirror, record on your phone, or simply speak to yourself.</p>
          </div>
          <div className="writing-area">
            <label className="input-label">
              What did you say? <span className="optional"> — write it down for AI feedback</span>
            </label>
            <textarea
              placeholder={timerDone
                ? 'Write a few sentences you said out loud...'
                : 'You can start writing here while you speak, or after the timer...'}
              value={speakingNotes}
              onChange={e => setSpeakingNotes(e.target.value)}
              className="text-input"
              rows={4}
              maxLength={MAX_LENGTH}
            />
            <div className="char-count">{speakingNotes.length} / {MAX_LENGTH}</div>
          </div>
        </>
      )}

      {timerDone && (
        <button className="btn-primary btn-done" onClick={handleSubmit}>
          {feedbackText.trim() ? 'Submit & Get Feedback ✓' : 'Mark as Done ✓'}
        </button>
      )}
    </div>
  )
}
