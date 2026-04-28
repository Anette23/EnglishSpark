import { useState } from 'react'
import SpeechRecorder from './SpeechRecorder'
import { SYNONYM_WORDS, PREPOSITION_PHRASES, SHADOWING_SENTENCES } from '../bonusExercises'

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

export default function BonusSession({ type, onBack }) {
  const list = type === 'synonyms'     ? SYNONYM_WORDS
             : type === 'prepositions' ? PREPOSITION_PHRASES
             : SHADOWING_SENTENCES

  const [idx, setIdx]           = useState(() => dailyStart(list))
  const [input, setInput]       = useState('')
  const [checked, setChecked]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  function next() {
    setIdx(i => (i + 1) % list.length)
    setInput('')
    setChecked(false)
    setTranscript('')
    setIsSpeaking(false)
  }

  const config = {
    synonyms:     { title: 'Synonyms',     icon: '🔤', accent: 'accent-blue' },
    prepositions: { title: 'Prepositions', icon: '📝', accent: 'accent-orange' },
    shadowing:    { title: 'Shadowing',    icon: '🎧', accent: 'accent-teal' },
  }[type]

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className={`task-header ${config.accent}`}>
        <span className="task-icon">{config.icon}</span>
        <div>
          <h2>{config.title}</h2>
          <p className="task-subtitle">Bonus exercise — optional</p>
        </div>
      </div>

      {type === 'synonyms' && (
        <SynonymsExercise
          item={list[idx]}
          input={input} setInput={setInput}
          checked={checked} setChecked={setChecked}
          onNext={next}
        />
      )}
      {type === 'prepositions' && (
        <PrepositionsExercise
          item={list[idx]}
          input={input} setInput={setInput}
          checked={checked} setChecked={setChecked}
          onNext={next}
        />
      )}
      {type === 'shadowing' && (
        <ShadowingExercise
          sentence={list[idx]}
          recKey={idx}
          transcript={transcript} setTranscript={setTranscript}
          isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking}
          onNext={next}
        />
      )}
    </div>
  )
}

function SynonymsExercise({ item, input, setInput, checked, setChecked, onNext }) {
  const userWords = input.toLowerCase().split(',').map(w => w.trim()).filter(Boolean)
  const correct   = checked ? userWords.filter(w => item.synonyms.includes(w)) : []
  const wrong     = checked ? userWords.filter(w => !item.synonyms.includes(w)) : []
  const missed    = checked ? item.synonyms.filter(s => !userWords.includes(s)) : []

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Find synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>

      <div>
        <label className="input-label">
          Your synonyms <span className="optional">— separated by commas</span>
        </label>
        <textarea
          className="text-input"
          rows={3}
          placeholder="e.g. glad, joyful, pleased..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
        />
      </div>

      {!checked && (
        <button className="btn-primary" onClick={() => setChecked(true)} disabled={!input.trim()}>
          Check
        </button>
      )}

      {checked && (
        <div className="bonus-result">
          {correct.length > 0
            ? <p className="result-correct">✅ You got {correct.length}: <strong>{correct.join(', ')}</strong></p>
            : <p className="result-wrong">❌ No exact matches — but keep trying!</p>
          }
          {wrong.length > 0 && (
            <p>Not quite: <span className="result-wrong-words">{wrong.join(', ')}</span></p>
          )}
          {missed.length > 0 && (
            <p>💡 Also valid: <span className="hint-words">{missed.join(', ')}</span></p>
          )}
          <button className="btn-primary" onClick={onNext}>Next word →</button>
        </div>
      )}
    </>
  )
}

function PrepositionsExercise({ item, input, setInput, checked, setChecked, onNext }) {
  const userAnswer = input.trim().toLowerCase()
  const isCorrect  = checked && item.answer.includes(userAnswer)
  const [before, after] = item.phrase.split('___')

  function handleCheck() {
    if (input.trim()) setChecked(true)
  }

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Fill in the preposition</div>
        <p className="prompt-text">
          {checked ? (
            <>
              {before}
              <span className={isCorrect ? 'answer-correct' : 'answer-shown'}>
                {item.answer.join(' / ')}
              </span>
              {after}
            </>
          ) : (
            <>{before}<span className="answer-blank">______</span>{after}</>
          )}
        </p>
      </div>

      <div className="prep-input-row">
        <input
          className="prep-input"
          type="text"
          placeholder="preposition..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          autoCapitalize="none"
          autoCorrect="off"
        />
        {!checked && (
          <button className="btn-primary btn-check" onClick={handleCheck} disabled={!input.trim()}>
            Check
          </button>
        )}
      </div>

      {checked && (
        <div className="bonus-result">
          <p className={isCorrect ? 'result-correct' : 'result-wrong'}>
            {isCorrect ? '✅ Correct!' : `❌ The answer is: ${item.answer.join(' or ')}`}
          </p>
          <p className="hint-text">💡 {item.hint}</p>
          <button className="btn-primary" onClick={onNext}>Next phrase →</button>
        </div>
      )}
    </>
  )
}

function ShadowingExercise({ sentence, recKey, transcript, setTranscript, isSpeaking, setIsSpeaking, onNext }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  function listen() {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(sentence)
    utt.lang = 'en-US'
    utt.rate = 0.85
    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    utt.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  const words    = sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
  const said     = transcript.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
  const matchPct = said.length > 0
    ? Math.round(said.filter(w => words.includes(w)).length / words.length * 100)
    : 0

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Listen, then repeat out loud</div>
        <p className="prompt-text">"{sentence}"</p>
      </div>

      <button
        className={`btn-listen ${isSpeaking ? 'btn-listening' : ''}`}
        onClick={listen}
        disabled={isSpeaking || !supported}
        type="button"
      >
        {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
      </button>

      {!supported && (
        <p className="rec-error">Text-to-speech is not supported in this browser.</p>
      )}

      <SpeechRecorder key={recKey} onTranscript={setTranscript} disabled={isSpeaking} />

      {transcript && (
        <div className="bonus-result">
          <p>Match: <span className="match-pct">{matchPct}%</span>
            {matchPct >= 80 ? ' — Great!' : matchPct >= 50 ? ' — Keep going!' : ' — Try again!'}
          </p>
          <button className="btn-primary" onClick={onNext}>Next sentence →</button>
        </div>
      )}
    </>
  )
}
