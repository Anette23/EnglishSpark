import { useState } from 'react'
import { getVocabulary, removeWord } from '../vocabularyStore'

export default function VocabularyView({ onBack }) {
  const [words, setWords] = useState(() => getVocabulary())
  const [search, setSearch] = useState('')

  function handleRemove(word) {
    removeWord(word)
    setWords(getVocabulary())
  }

  const filtered = words.filter(w =>
    w.word.includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>My Vocabulary</h2>
          <p className="task-subtitle">{words.length} saved word{words.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {words.length === 0 ? (
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p>No words saved yet.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Tap any word in exercises or chat to translate it, then save it here.
          </p>
        </div>
      ) : (
        <>
          <input
            className="vocab-search"
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="vocab-list">
            {filtered.map(w => (
              <div key={w.word} className="vocab-item">
                <div className="vocab-item-main">
                  <span className="vocab-word">{w.word}</span>
                  <span className="vocab-translation">{w.translation}</span>
                </div>
                {w.context && (
                  <p className="vocab-context">"{w.context}"</p>
                )}
                <div className="vocab-meta">
                  <span className="vocab-date">{w.date}</span>
                  <button className="vocab-remove" onClick={() => handleRemove(w.word)}>✕ Remove</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>No matches.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
