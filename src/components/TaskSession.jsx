import { useState } from 'react'
import Timer from './Timer'
import { getDailyPrompt, WRITING_PROMPTS, SPEAKING_PROMPTS } from '../prompts'
import { formatDuration } from '../habitStore'

export default function TaskSession({ taskType, duration, onComplete, onBack }) {
  const [text, setText] = useState('')
  const [timerDone, setTimerDone] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isWriting = taskType === 'writing'
  const prompt = getDailyPrompt(isWriting ? WRITING_PROMPTS : SPEAKING_PROMPTS)
  const icon = isWriting ? '✍️' : '🎤'
  const accentColor = isWriting ? 'accent-purple' : 'accent-green'

  function handleTimerComplete() {
    setTimerDone(true)
  }

  function handleSubmit() {
    setSubmitted(true)
    onComplete()
  }

  if (submitted) {
    return (
      <div className="session-complete">
        <div className="complete-icon">⭐</div>
        <h2>Amazing work!</h2>
        <p>+25 XP earned</p>
        <button className="btn-primary" onClick={onBack}>Back to Dashboard</button>
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
        onComplete={handleTimerComplete}
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
        <div className="speaking-hint">
          <p>🎤 Speak out loud for {formatDuration(duration)}.</p>
          <p>No recording needed — just talk! You can use a mirror, record on your phone, or simply speak to yourself.</p>
        </div>
      )}

      {timerDone && (
        <button className="btn-primary btn-done" onClick={handleSubmit}>
          Mark as Done ✓
        </button>
      )}
    </div>
  )
}
