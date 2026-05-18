const KEY = 'reading_progress'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function getCompletedIds() {
  return load().completed || []
}

export function markRead(id) {
  const data = load()
  const completed = data.completed || []
  if (!completed.includes(id)) {
    completed.push(id)
    try { localStorage.setItem(KEY, JSON.stringify({ ...data, completed })) } catch {}
  }
}

export function isRead(id) {
  return (load().completed || []).includes(id)
}

export function resetLevel(level, allExercises) {
  const data = load()
  const levelIds = allExercises.filter(e => e.level === level).map(e => e.id)
  const completed = (data.completed || []).filter(id => !levelIds.includes(id))
  try { localStorage.setItem(KEY, JSON.stringify({ ...data, completed })) } catch {}
}
