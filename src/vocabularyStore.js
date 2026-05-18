const KEY = 'vocabulary_notebook'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function getVocabulary() {
  return load()
}

export function saveWord({ word, translation, context, source }) {
  const all = load()
  if (all.some(w => w.word.toLowerCase() === word.toLowerCase())) return // already saved
  all.unshift({
    word: word.toLowerCase(),
    translation,
    context: context || '',
    source: source || '',
    date: new Date().toISOString().slice(0, 10),
  })
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200))) } catch {}
}

export function removeWord(word) {
  const all = load().filter(w => w.word.toLowerCase() !== word.toLowerCase())
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch {}
}

export function isWordSaved(word) {
  return load().some(w => w.word.toLowerCase() === word.toLowerCase())
}
