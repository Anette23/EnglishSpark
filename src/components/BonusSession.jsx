import { useState } from 'react'
import SpeechRecorder from './SpeechRecorder'
import { SYNONYM_WORDS, PREPOSITION_PHRASES, IDIOM_PHRASES, SHADOWING_SENTENCES, getListForLevel } from '../bonusExercises'

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

const LEVELS = ['B1', 'B2']

export default function BonusSession({ type, onBack }) {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('exerciseLevel')
    return saved === 'A2' ? 'B1' : (saved || 'B1')
  })

  const fullList = type === 'synonyms'     ? SYNONYM_WORDS
                 : type === 'prepositions' ? PREPOSITION_PHRASES
                 : type === 'idioms'       ? IDIOM_PHRASES
                 : SHADOWING_SENTENCES

  const list = getListForLevel(fullList, level)

  const [idx, setIdx]           = useState(() => dailyStart(list))
  const [input, setInput]       = useState('')
  const [checked, setChecked]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  function changeLevel(l) {
    localStorage.setItem('exerciseLevel', l)
    setLevel(l)
    setIdx(dailyStart(getListForLevel(fullList, l)))
    setInput('')
    setChecked(false)
    setTranscript('')
  }

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
    idioms:       { title: 'Idioms',       icon: '💬', accent: 'accent-purple' },
    shadowing:    { title: 'Shadowing',    icon: '🎧', accent: 'accent-teal' },
  }[type]

  const item = list[idx % list.length]

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

      <div className="level-toggle">
        {LEVELS.map(l => (
          <button
            key={l}
            className={`level-btn ${level === l ? 'level-btn-active' : ''}`}
            onClick={() => changeLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {type === 'synonyms' && (
        <SynonymsExercise
          key={`${level}-${idx}`}
          item={item}
          allItems={list}
          onNext={next}
        />
      )}
      {type === 'prepositions' && (
        <PrepositionsExercise
          item={item}
          input={input} setInput={setInput}
          checked={checked} setChecked={setChecked}
          onNext={next}
        />
      )}
      {type === 'idioms' && (
        <PrepositionsExercise
          item={item}
          input={input} setInput={setInput}
          checked={checked} setChecked={setChecked}
          onNext={next}
        />
      )}
      {type === 'shadowing' && (
        <ShadowingExercise
          sentence={item.sentence}
          recKey={`${level}-${idx}`}
          transcript={transcript} setTranscript={setTranscript}
          isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking}
          onNext={next}
        />
      )}
    </div>
  )
}

function buildMcOptions(item, allItems) {
  const correct = [...item.synonyms].sort(() => Math.random() - 0.5).slice(0, 3)
  const distractors = allItems
    .filter(w => w.word !== item.word)
    .flatMap(w => w.synonyms.slice(0, 2))
    .filter(s => !item.synonyms.includes(s))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  return [...correct, ...distractors].sort(() => Math.random() - 0.5)
}

const SYN_STEPS = ['Try', 'See all', 'Pick', 'Use it']

function SynSteps({ current }) {
  return (
    <div className="syn-steps">
      {SYN_STEPS.map((label, i) => (
        <span key={label} className={`syn-step ${i === current ? 'syn-step-active' : i < current ? 'syn-step-done' : ''}`}>
          {i < current ? '✓' : `${i + 1}.`} {label}
        </span>
      ))}
    </div>
  )
}

function SynonymsExercise({ item, allItems, onNext }) {
  const [phase, setPhase]               = useState('recall')
  const [input, setInput]               = useState('')
  const [hintsShown, setHintsShown]     = useState(0)
  const [mcOptions]                     = useState(() => buildMcOptions(item, allItems))
  const [mcSelected, setMcSelected]     = useState(new Set())
  const [mcChecked, setMcChecked]       = useState(false)
  const [sentence, setSentence]         = useState('')
  const [sentenceSent, setSentenceSent] = useState(false)

  const userWords  = input.toLowerCase().split(',').map(w => w.trim()).filter(Boolean)
  const gotCorrect = phase !== 'recall' ? userWords.filter(w => item.synonyms.includes(w)) : []
  const gotWrong   = phase !== 'recall' ? userWords.filter(w => !item.synonyms.includes(w)) : []
  const revealedHints  = item.synonyms.slice(0, hintsShown)
  const suggestedWord  = gotCorrect[0] || item.synonyms[0]
  const usedSynonym    = sentenceSent
    ? item.synonyms.find(s => sentence.toLowerCase().includes(s.toLowerCase()))
    : null

  // ── Phase 1: Recall ──────────────────────────────
  if (phase === 'recall') return (
    <>
      <SynSteps current={0} />
      <div className="prompt-box">
        <div className="prompt-label">Find synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>

      {revealedHints.length > 0 && (
        <div className="syn-hint-strip">
          {revealedHints.map(h => <span key={h} className="hint-chip">💡 {h}</span>)}
        </div>
      )}

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
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      <div className="syn-recall-btns">
        {hintsShown < item.synonyms.length && (
          <button className="btn-hint" type="button" onClick={() => setHintsShown(h => h + 1)}>
            💡 Hint ({hintsShown}/{item.synonyms.length})
          </button>
        )}
        <button className="btn-primary btn-check" onClick={() => setPhase('results')}>
          {input.trim() ? 'Check →' : 'Show me →'}
        </button>
      </div>
    </>
  )

  // ── Phase 2: Results + all synonyms ──────────────
  if (phase === 'results') return (
    <>
      <SynSteps current={1} />
      <div className="prompt-box">
        <div className="prompt-label">Synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>

      {gotCorrect.length > 0
        ? <p className="result-correct">✅ You got {gotCorrect.length} right — well done!</p>
        : input.trim()
          ? <p className="result-wrong">❌ No exact matches — learn them now:</p>
          : <p className="result-neutral">Here are all the synonyms:</p>
      }
      {gotWrong.length > 0 && (
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          Not quite: <span className="result-wrong-words">{gotWrong.join(', ')}</span>
        </p>
      )}

      <div>
        <div className="syn-chips-label">All synonyms for <strong>{item.word}</strong>:</div>
        <div className="syn-chips">
          {item.synonyms.map(s => (
            <span key={s} className={`syn-chip ${gotCorrect.includes(s) ? 'syn-chip-got' : 'syn-chip-new'}`}>
              {gotCorrect.includes(s) ? '✓ ' : ''}{s}
            </span>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={() => setPhase('recognition')}>
        Continue →
      </button>
    </>
  )

  // ── Phase 3: Multiple choice ──────────────────────
  if (phase === 'recognition') return (
    <>
      <SynSteps current={2} />
      <div className="prompt-box">
        <div className="prompt-label">Pick all synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>

      <p className="syn-mc-hint">Tap every word that fits:</p>
      <div className="mc-grid">
        {mcOptions.map(opt => {
          const isSelected = mcSelected.has(opt)
          const isCorrect  = item.synonyms.includes(opt)
          let cls = 'mc-option'
          if (mcChecked) {
            cls += isCorrect ? ' mc-correct' : isSelected ? ' mc-wrong' : ''
          } else if (isSelected) {
            cls += ' mc-selected'
          }
          return (
            <button key={opt} className={cls} type="button"
              onClick={() => {
                if (mcChecked) return
                setMcSelected(prev => {
                  const n = new Set(prev)
                  n.has(opt) ? n.delete(opt) : n.add(opt)
                  return n
                })
              }}
            >{opt}</button>
          )
        })}
      </div>

      {!mcChecked
        ? <button className="btn-primary btn-check" onClick={() => setMcChecked(true)}>Check →</button>
        : <>
            <p className="result-correct">✅ Green = synonyms. Now for the last step!</p>
            <button className="btn-primary" onClick={() => setPhase('sentence')}>Last step →</button>
          </>
      }
    </>
  )

  // ── Phase 4: Write a sentence ─────────────────────
  return (
    <>
      <SynSteps current={3} />
      <div className="prompt-box">
        <div className="prompt-label">Write a sentence using</div>
        <p className="bonus-word">{suggestedWord}</p>
        <p className="syn-sentence-note">or any synonym you like</p>
      </div>

      {!sentenceSent ? (
        <>
          <textarea
            className="text-input"
            rows={3}
            placeholder={`e.g. "I was so ${suggestedWord} when I heard the news."`}
            value={sentence}
            onChange={e => setSentence(e.target.value)}
          />
          <button
            className="btn-primary btn-check"
            onClick={() => setSentenceSent(true)}
            disabled={sentence.trim().length < 5}
          >
            Submit
          </button>
        </>
      ) : (
        <div className="bonus-result">
          {usedSynonym
            ? <p className="result-correct">✅ You used <strong>{usedSynonym}</strong> — perfect!</p>
            : <p className="result-correct">✅ Nice sentence! Try to include the word next time.</p>
          }
          {item.example && (
            <div className="syn-example-box">
              <div className="syn-example-label">Example</div>
              <p className="syn-example-text">"{item.example}"</p>
            </div>
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
        <div className="prompt-label">Fill in the missing word</div>
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
          placeholder="your answer..."
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
          <button className="btn-primary" onClick={onNext}>Next →</button>
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
