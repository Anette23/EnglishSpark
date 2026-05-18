import { useState } from 'react'
import SpeechRecorder from './SpeechRecorder'
import { SYNONYM_WORDS, PREPOSITION_PHRASES, IDIOM_PHRASES, SHADOWING_SENTENCES, getListForLevel } from '../bonusExercises'
import { GRAMMAR_EXERCISES } from '../grammarExercises'
import { completeDailyBonusGoal } from '../habitStore'
import { checkSentence } from '../api'
import { saveFlashcard, getFlashcardStats, getDailyProgress, incrementDailyProgress, DAILY_GOAL } from '../flashcardStore'
import FlashcardReview from './FlashcardReview'

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

// Spaced repetition helpers for synonyms
function loadSynPerf() {
  try { return JSON.parse(localStorage.getItem('syn_perf') || '{}') } catch { return {} }
}
function saveSynWordScore(word, score) {
  const perf = loadSynPerf()
  const prev = perf[word]?.score ?? 1
  perf[word] = { score: prev * 0.4 + score * 0.6, lastSeen: new Date().toISOString().slice(0, 10) }
  localStorage.setItem('syn_perf', JSON.stringify(perf))
}
function getWeakIdx(list, excludeIdx) {
  const perf = loadSynPerf()
  const weak = list
    .map((item, i) => ({ i, word: item.word, ...perf[item.word] }))
    .filter(x => {
      if (x.i === excludeIdx) return false
      if ((x.score ?? 1) >= 0.5) return false
      const daysSince = x.lastSeen
        ? Math.round((Date.now() - new Date(x.lastSeen)) / 86400000)
        : 999
      return daysSince >= 5
    })
    .sort(() => Math.random() - 0.5)
  return weak.length > 0 ? weak[0].i : null
}

function smartSynStart(list) {
  const weakIdx = getWeakIdx(list, -1)
  if (weakIdx !== null && Math.random() < 0.4) return weakIdx
  return dailyStart(list)
}

function nextSynIdx(list, currentIdx) {
  // 40% chance: pick a qualifying weak word (not current), else advance sequentially
  const weakIdx = getWeakIdx(list, currentIdx)
  if (weakIdx !== null && Math.random() < 0.4) return weakIdx
  return (currentIdx + 1) % list.length
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
                 : type === 'grammar'      ? GRAMMAR_EXERCISES
                 : SHADOWING_SENTENCES

  const [grammarShuffled, setGrammarShuffled] = useState(() => {
    if (type !== 'grammar') return null
    return [...GRAMMAR_EXERCISES.filter(e => e.level === level)].sort(() => Math.random() - 0.5)
  })

  const list = type === 'grammar'
    ? (grammarShuffled || GRAMMAR_EXERCISES.filter(e => e.level === level))
    : getListForLevel(fullList, level)

  const startIdx = type === 'synonyms' ? () => smartSynStart(list) : () => dailyStart(list)
  const [idx, setIdx]           = useState(startIdx)
  const [round, setRound]       = useState(0)
  const [input, setInput]       = useState('')
  const [checked, setChecked]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [dailyCount, setDailyCount] = useState(() => getDailyProgress(type))
  const [goalJustDone, setGoalJustDone] = useState(false)
  const [reviewing, setReviewing]   = useState(false)

  function itemFlashcardId(item) {
    if (type === 'synonyms')  return item.word
    if (type === 'grammar')   return item.id
    if (type === 'shadowing') return item.sentence
    return item.phrase
  }

  function changeLevel(l) {
    localStorage.setItem('exerciseLevel', l)
    setLevel(l)
    if (type === 'grammar') {
      const shuffled = [...GRAMMAR_EXERCISES.filter(e => e.level === l)].sort(() => Math.random() - 0.5)
      setGrammarShuffled(shuffled)
      setIdx(0)
    } else {
      const newList = getListForLevel(fullList, l)
      setIdx(type === 'synonyms' ? smartSynStart(newList) : dailyStart(newList))
    }
    setInput('')
    setChecked(false)
    setTranscript('')
  }

  function next(score) {
    const item = list[idx % list.length]
    if (score !== undefined) saveFlashcard(type, itemFlashcardId(item), score)

    let nextIdx
    if (type === 'synonyms' && score !== undefined) {
      saveSynWordScore(item.word, score)
      nextIdx = nextSynIdx(list, idx % list.length)
    } else {
      nextIdx = (idx + 1) % list.length
    }

    const newCount = incrementDailyProgress(type)
    setDailyCount(newCount)
    setIdx(nextIdx)
    setRound(r => r + 1)
    setInput('')
    setChecked(false)
    setTranscript('')
    setIsSpeaking(false)

    if (newCount === DAILY_GOAL) {
      completeDailyBonusGoal(type)
      setGoalJustDone(true)
    }
  }

  const stats = getFlashcardStats(type, list)

  const config = {
    synonyms:     { title: 'Synonyms',     icon: '🔤', accent: 'accent-blue'   },
    prepositions: { title: 'Prepositions', icon: '📝', accent: 'accent-orange' },
    idioms:       { title: 'Idioms',       icon: '💬', accent: 'accent-purple' },
    shadowing:    { title: 'Shadowing',    icon: '🎧', accent: 'accent-teal'   },
    grammar:      { title: 'Grammar',      icon: '📚', accent: 'accent-green'  },
  }[type]

  const item = list[idx % list.length]

  if (reviewing) {
    return <FlashcardReview type={type} items={list} onClose={() => setReviewing(false)} />
  }

  if (goalJustDone) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="daily-goal-complete">
          <div className="complete-icon">🎯</div>
          <h2>Daily goal done!</h2>
          <div className="goal-xp-badge">+20 XP</div>
          <p className="goal-subtitle">You completed {DAILY_GOAL} {config.title} exercises today!</p>
        </div>
        <div className="goal-done-btns">
          <button className="btn-primary" onClick={onBack}>Done ✓</button>
          <button className="btn-secondary" style={{ width: '100%', padding: 14, fontSize: 16 }} onClick={() => setGoalJustDone(false)}>
            Keep going →
          </button>
        </div>
      </div>
    )
  }

  const clampedCount = Math.min(dailyCount, DAILY_GOAL)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className={`task-header ${config.accent}`}>
        <span className="task-icon">{config.icon}</span>
        <div>
          <h2>{config.title}</h2>
          <p className="task-subtitle">Bonus exercise — optional</p>
        </div>
        {stats.due > 0 && (
          <button className="btn-review-pill" onClick={() => setReviewing(true)}>
            🗂 Review {stats.due}
          </button>
        )}
      </div>

      <div className="daily-progress-row">
        <div className="daily-progress-bar-wrap">
          <div className="daily-progress-bar-fill" style={{ width: `${clampedCount / DAILY_GOAL * 100}%` }} />
        </div>
        <span className="daily-progress-label">
          {dailyCount >= DAILY_GOAL ? `✓ ${DAILY_GOAL}/${DAILY_GOAL} done!` : `${dailyCount} / ${DAILY_GOAL} today`}
        </span>
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
          key={`${level}-${idx}-${round}`}
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
      {type === 'grammar' && (
        <GrammarExercise
          key={`${level}-${idx}-${round}`}
          item={item}
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
  const [sentenceCheck, setSentenceCheck] = useState(null)   // { ok, feedback } from AI
  const [sentenceLoading, setSentenceLoading] = useState(false)

  const userWords  = input.toLowerCase().split(',').map(w => w.trim()).filter(Boolean)
  const gotCorrect = phase !== 'recall' ? userWords.filter(w => item.synonyms.includes(w)) : []
  const gotWrong   = phase !== 'recall' ? userWords.filter(w => !item.synonyms.includes(w)) : []
  const revealedHints  = item.synonyms.slice(0, hintsShown)
  const suggestedWord  = gotCorrect[0] || item.synonyms[0]

  async function handleSentenceSubmit() {
    setSentenceSent(true)
    setSentenceLoading(true)
    try {
      const result = await checkSentence(suggestedWord, sentence)
      setSentenceCheck(result)
    } catch {
      setSentenceCheck(null)
    } finally {
      setSentenceLoading(false)
    }
  }

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
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setPhase('results') } }}
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
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && sentence.trim().length >= 5) { e.preventDefault(); handleSentenceSubmit() } }}
          />
          <button
            className="btn-primary btn-check"
            onClick={handleSentenceSubmit}
            disabled={sentence.trim().length < 5}
          >
            Submit
          </button>
        </>
      ) : (
        <div className="bonus-result">
          {sentenceLoading && <p className="syn-checking">⏳ Checking your sentence...</p>}

          {!sentenceLoading && sentenceCheck && (
            <p className={sentenceCheck.ok ? 'result-correct' : 'result-wrong'}>
              {sentenceCheck.ok ? '✅' : '❌'} {sentenceCheck.feedback}
            </p>
          )}

          {!sentenceLoading && !sentenceCheck && (
            <p className="result-correct">✅ Sentence submitted!</p>
          )}

          {!sentenceLoading && item.example && (
            <div className="syn-example-box">
              <div className="syn-example-label">Example</div>
              <p className="syn-example-text">"{item.example}"</p>
            </div>
          )}

          {!sentenceLoading && (
            <button className="btn-primary" onClick={() => onNext(gotCorrect.length / item.synonyms.length)}>Next word →</button>
          )}
        </div>
      )}
    </>
  )
}

function GrammarExercise({ item, onNext }) {
  const [input, setInput]   = useState('')
  const [checked, setChecked] = useState(false)
  const userAnswer = input.trim().toLowerCase()
  const isCorrect  = checked && item.answer.includes(userAnswer)
  const [before, after] = item.phrase.split('___')

  function handleCheck() { if (input.trim()) setChecked(true) }

  return (
    <>
      <div className="grammar-category-badge">{item.category}</div>
      <div className="prompt-box">
        <div className="prompt-label">Fill in the blank</div>
        <p className="prompt-text">
          {checked ? (
            <>
              {before}
              <span className={isCorrect ? 'answer-correct' : 'answer-shown'}>
                {item.answer[0]}
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
            {isCorrect ? '✅ Correct!' : `❌ Answer: ${item.answer.join(' / ')}`}
          </p>
          {item.hint && <p className="grammar-hint">💡 {item.hint}</p>}
          <p className="grammar-explanation">{item.explanation}</p>
          <button className="btn-primary" onClick={() => onNext(isCorrect ? 1.0 : 0.0)}>Next →</button>
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
          <button className="btn-primary" onClick={() => onNext(isCorrect ? 1.0 : 0.0)}>Next →</button>
        </div>
      )}
    </>
  )
}

function ShadowingExercise({ sentence, recKey, transcript, setTranscript, isSpeaking, setIsSpeaking, onNext }) {
  const [retryKey, setRetryKey] = useState(0)
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

  function handleRetry() {
    setTranscript('')
    setRetryKey(k => k + 1)
  }

  const words    = sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
  const said     = transcript.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
  const matchPct = said.length > 0
    ? Math.round(said.filter(w => words.includes(w)).length / words.length * 100)
    : 0
  const missedWords = words.filter(w => !said.includes(w))

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

      <SpeechRecorder key={`${recKey}-${retryKey}`} onTranscript={setTranscript} disabled={isSpeaking} />

      {transcript && (
        <div className="bonus-result">
          <p>Match: <span className="match-pct">{matchPct}%</span>
            {matchPct >= 80 ? ' — Great!' : matchPct >= 50 ? ' — Getting there!' : ' — Keep practicing!'}
          </p>

          <div className="shadow-sentence-feedback">
            {words.map((word, i) => {
              const ok = said.includes(word)
              return (
                <span
                  key={i}
                  className={ok ? 'shadow-word-ok' : 'shadow-word-miss shadow-word-tap'}
                  onClick={ok ? undefined : () => {
                    window.speechSynthesis.cancel()
                    const utt = new SpeechSynthesisUtterance(word)
                    utt.lang = 'en-US'
                    utt.rate = 0.8
                    window.speechSynthesis.speak(utt)
                  }}
                >
                  {word}{' '}
                </span>
              )
            })}
          </div>
          {missedWords.length > 0 && (
            <p className="shadow-tap-hint">👆 Tap a red word to hear it</p>
          )}

          <p className="shadow-transcript">You said: <em>"{transcript}"</em></p>

          <div className="shadow-action-btns">
            <button className="btn-secondary" style={{ width: '100%', padding: 12, fontSize: 15 }} onClick={handleRetry}>
              🔄 Try again
            </button>
            <button className="btn-primary" onClick={() => onNext(matchPct >= 50 ? 0.9 : 0.4)}>
              Next sentence →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
