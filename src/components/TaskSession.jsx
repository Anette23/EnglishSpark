import { useState } from 'react'
import Timer from './Timer'
import FeedbackView from './FeedbackView'
import SpeechRecorder from './SpeechRecorder'
import { getDailyPrompt, WRITING_PROMPTS, SPEAKING_PROMPTS } from '../prompts'
import { formatDuration, todayStr, saveTaskResult } from '../habitStore'
import { getFeedback } from '../api'

const MAX_LENGTH = 2000

export default function TaskSession({ taskType, duration, onComplete, onBack }) {
  const [text, setText]                   = useState('')
  const [speakingNotes, setSpeakingNotes] = useState('')
  const [timerDone, setTimerDone]         = useState(false)
  const [submitted, setSubmitted]         = useState(false)
  const [feedback, setFeedback]           = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  const isWriting    = taskType === 'writing'
  const prompt       = getDailyPrompt(isWriting ? WRITING_PROMPTS : SPEAKING_PROMPTS)
  const accentColor  = isWriting ? 'accent-purple' : 'accent-green'
  const feedbackText = isWriting ? text : speakingNotes

  async function handleSubmit() {
    const date = todayStr()
    setSubmitted(true)
    onComplete()

    if (!feedbackText.trim()) {
      saveTaskResult(date, taskType, { text: '', feedback: null, prompt })
      return
    }

    setFeedbackLoading(true)
    setFeedbackError(null)
    let feedbackResult = null
    try {
      feedbackResult = await getFeedback(taskType, feedbackText)
      setFeedback(feedbackResult)
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
      saveTaskResult(date, taskType, { text: feedbackText, feedback: feedbackResult, prompt })
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
          : <div className="feedback-box feedback-hint">💡 Next time write or record something to get AI feedback.</div>
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
        <span className="task-icon">{isWriting ? '✍️' : '🎤'}</span>
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
            <p>🎤 Speak out loud in English about the prompt above.</p>
            <p>Use the recorder below for automatic transcription, or write your answer manually.</p>
          </div>

          <SpeechRecorder
            onTranscript={t => setSpeakingNotes(t)}
            disabled={false}
          />

          <div className="writing-area">
            <label className="input-label">
              Your answer <span className="optional">— edit transcript or write manually</span>
            </label>
            <textarea
              placeholder="Transcript appears here automatically, or write it yourself..."
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
