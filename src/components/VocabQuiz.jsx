import { useState, useMemo } from 'react'
import { getVocabulary, removeWord } from '../vocabularyStore'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalise(str) {
  return str.trim().toLowerCase().replace(/[^a-z'-]/g, '')
}

export default function VocabQuiz({ onBack }) {
  const words = useMemo(() => shuffle(getVocabulary()), [])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)

  if (words.length === 0) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-blue">
          <span className="task-icon">🃏</span>
          <div><h2>Vocabulary Quiz</h2><p className="task-subtitle">No words saved yet</p></div>
        </div>
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p>Save words from exercises, chat, or reading first.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Tap any word → translate → Save to vocabulary.</p>
        </div>
        <button className="btn-primary" onClick={onBack}>Go back</button>
      </div>
    )
  }

  if (finished) {
    const total = correct + wrong
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🃏</div>
          <h2>Quiz complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">correct answers</div>
          </div>
          {correct === total && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>
              ⭐ Perfect score!
            </p>
          )}
          <button className="btn-primary" onClick={onBack}>Back to vocabulary</button>
        </div>
      </div>
    )
  }

  const word = words[idx]

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    if (normalise(input) === normalise(word.word)) {
      setCorrect(c => c + 1)
    } else {
      setWrong(w => w + 1)
    }
  }

  function handleNext() {
    if (idx + 1 < words.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  const isCorrect = checked && normalise(input) === normalise(word.word)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">🃏</span>
        <div>
          <h2>Vocabulary Quiz</h2>
          <p className="task-subtitle">{idx + 1} / {words.length}</p>
        </div>
      </div>

      <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="prompt-label">What is the English word for?</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--purple)', textAlign: 'center', padding: '8px 0' }}>
          {word.translation}
        </div>
        {word.context && (
          <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
            "{word.context}"
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="vocab-search"
          type="text"
          placeholder="Type the English word..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !checked) handleCheck() }}
          disabled={checked}
          autoFocus
          style={{ flex: 1 }}
        />
        {!checked && (
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={!input.trim()}
            style={{ width: 'auto', padding: '10px 20px', fontSize: 15 }}
          >
            Check
          </button>
        )}
      </div>

      {checked && (
        <div style={{
          background: isCorrect ? 'var(--green-light)' : '#fee2e2',
          border: `1.5px solid ${isCorrect ? 'var(--green)' : '#ef4444'}`,
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ fontWeight: 700, color: isCorrect ? '#065f46' : '#991b1b', fontSize: 16 }}>
            {isCorrect ? '✓ Correct!' : `✗ The answer is: ${word.word}`}
          </div>
          {!isCorrect && (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>You typed: {input}</div>
          )}
        </div>
      )}

      {checked && (
        <button className={`btn-primary ${isCorrect ? 'btn-done' : ''}`} onClick={handleNext}>
          {idx + 1 < words.length ? 'Next word →' : 'See results'}
        </button>
      )}
    </div>
  )
}
