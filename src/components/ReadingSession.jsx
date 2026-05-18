import { useState, useMemo } from 'react'
import { READING_EXERCISES } from '../readingExercises'
import { getCompletedIds, markRead, resetLevel } from '../readingStore'
import TranslatableText from './TranslatableText'

const LEVELS = ['B1', 'B2', 'C1']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getLevelCounts(level) {
  const all = READING_EXERCISES.filter(e => e.level === level)
  const done = getCompletedIds()
  const unread = all.filter(e => !done.includes(e.id))
  return { total: all.length, unread: unread.length }
}

export default function ReadingSession({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState('B2')
  const [started, setStarted] = useState(false)
  const [levelCounts, setLevelCounts] = useState(() => ({
    B1: getLevelCounts('B1'),
    B2: getLevelCounts('B2'),
    C1: getLevelCounts('C1'),
  }))

  // exercises for this session = unread texts for selected level, shuffled
  const [exercises, setExercises] = useState([])

  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('read') // 'read' | 'questions' | 'done' | 'finished'
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState([])

  function refreshCounts() {
    setLevelCounts({
      B1: getLevelCounts('B1'),
      B2: getLevelCounts('B2'),
      C1: getLevelCounts('C1'),
    })
  }

  function handleStart() {
    const completed = getCompletedIds()
    const unread = READING_EXERCISES.filter(e => e.level === selectedLevel && !completed.includes(e.id))
    setExercises(shuffle(unread))
    setIdx(0)
    setPhase('read')
    setAnswers([])
    setScores([])
    setStarted(true)
  }

  function handleReset() {
    resetLevel(selectedLevel, READING_EXERCISES)
    refreshCounts()
  }

  function handleBack() {
    if (started) {
      setStarted(false)
      refreshCounts()
    } else {
      onBack()
    }
  }

  // ── Level picker ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>

        <div className="task-header accent-blue">
          <span className="task-icon">📖</span>
          <div>
            <h2>Reading</h2>
            <p className="task-subtitle">Choose your level</p>
          </div>
        </div>

        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Read short English texts and answer comprehension questions. Completed texts won't repeat until you've read them all.
          </p>

          <div style={{ display: 'flex', gap: 8 }}>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`level-btn ${selectedLevel === l ? 'level-btn-active' : ''}`}
                onClick={() => setSelectedLevel(l)}
                style={{ flex: 1 }}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {selectedLevel === 'B1' && 'Everyday topics, clear sentences, common vocabulary.'}
            {selectedLevel === 'B2' && 'Complex topics, nuanced arguments, advanced vocabulary.'}
            {selectedLevel === 'C1' && 'Academic and abstract texts, sophisticated vocabulary, subtle reasoning.'}
          </div>

          {/* Progress indicator */}
          {(() => {
            const { total, unread } = levelCounts[selectedLevel]
            const done = total - unread
            const allDone = unread === 0
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(done / total) * 100}%`,
                      background: allDone ? 'var(--green)' : 'var(--purple)',
                      borderRadius: 4,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {done}/{total} read
                  </span>
                </div>
                {allDone ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                      ✓ All {total} texts read!
                    </span>
                    <button
                      onClick={handleReset}
                      style={{ fontSize: 12, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                    >
                      Reset & repeat
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {unread} new text{unread !== 1 ? 's' : ''} waiting
                  </span>
                )}
              </div>
            )
          })()}
        </div>

        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={levelCounts[selectedLevel].unread === 0}
          style={{ opacity: levelCounts[selectedLevel].unread === 0 ? 0.45 : 1 }}
        >
          {levelCounts[selectedLevel].unread === 0 ? 'No new texts — reset to repeat' : 'Start reading →'}
        </button>
      </div>
    )
  }

  // ── No exercises left (shouldn't normally happen but guard anyway) ─────────
  const ex = exercises[idx] ?? null
  if (!ex || phase === 'finished') {
    const totalCorrect = scores.reduce((a, b) => a + b, 0)
    const totalQuestions = exercises.slice(0, scores.length).reduce((a, e) => a + e.questions.length, 0)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">📖</div>
          <h2>Session complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{totalCorrect}/{totalQuestions}</div>
            <div className="reading-score-label">questions correct</div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>
            Completed texts won't appear again until you've read them all.
          </p>
          <button className="btn-primary" onClick={handleBack} style={{ marginTop: 8 }}>
            Choose another level
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Reading / questions / answer review ───────────────────────────────────
  function handleStartQuestions() {
    setAnswers(Array(ex.questions.length).fill(null))
    setPhase('questions')
  }

  function handleAnswer(qIdx, optIdx) {
    setAnswers(prev => {
      if (prev[qIdx] !== null) return prev
      const next = [...prev]
      next[qIdx] = optIdx
      return next
    })
  }

  function handleSubmitQuestions() {
    const correct = ex.questions.filter((q, i) => answers[i] === q.answer).length
    setScores(prev => [...prev, correct])
    markRead(ex.id)
    setPhase('done')
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setAnswers([])
      setPhase('read')
    } else {
      setPhase('finished')
    }
  }

  const allAnswered = answers.length > 0 && answers.every(a => a !== null)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={handleBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>Reading · {selectedLevel}</h2>
          <p className="task-subtitle">Text {idx + 1} of {exercises.length}</p>
        </div>
      </div>

      {phase === 'read' && (
        <>
          <div className="reading-passage">
            <div className="reading-passage-title">{ex.title}</div>
            {ex.passage.split('\n\n').map((para, i, arr) => (
              <p key={i} style={{ marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                <TranslatableText text={para} />
              </p>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            Tap any word to see its Slovak translation
          </p>
          <button className="btn-primary" onClick={handleStartQuestions}>
            Answer questions →
          </button>
        </>
      )}

      {phase === 'questions' && (
        <>
          <div className="reading-q-header">Comprehension questions</div>
          {ex.questions.map((q, qi) => (
            <div key={qi} className="reading-question">
              <div className="reading-question-text">{qi + 1}. {q.q}</div>
              <div className="reading-options">
                {q.options.map((opt, oi) => {
                  let cls = 'reading-option'
                  if (answers[qi] !== null) {
                    if (oi === q.answer) cls += ' reading-option-correct'
                    else if (answers[qi] === oi) cls += ' reading-option-wrong'
                  }
                  return (
                    <button
                      key={oi}
                      className={cls}
                      onClick={() => handleAnswer(qi, oi)}
                      disabled={answers[qi] !== null}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          <button
            className="btn-primary"
            onClick={handleSubmitQuestions}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5 }}
          >
            See results
          </button>
        </>
      )}

      {phase === 'done' && (
        <>
          <div className="reading-score-card">
            <div className="reading-score-number">
              {scores[scores.length - 1]}/{ex.questions.length}
            </div>
            <div className="reading-score-label">correct on "{ex.title}"</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ex.questions.map((q, qi) => (
              <div key={qi} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{q.q}</div>
                <div style={{
                  fontSize: 14,
                  color: answers[qi] === q.answer ? 'var(--green)' : '#ef4444',
                  fontWeight: 600,
                }}>
                  {answers[qi] === q.answer ? '✓ ' : '✗ '}{q.options[answers[qi]]}
                </div>
                {answers[qi] !== q.answer && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    Correct: {q.options[q.answer]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {idx + 1 < exercises.length ? (
            <button className="btn-primary" onClick={handleNext}>
              Next text →
            </button>
          ) : (
            <button className="btn-primary btn-done" onClick={handleNext}>
              Finish session ✓
            </button>
          )}
        </>
      )}
    </div>
  )
}
