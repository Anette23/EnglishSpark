const STORAGE_KEY = 'english_habit_v1'
const INTEGRITY_SEED = 'es_k9x2mQ7vR4nL'

export const MILESTONES = [
  { days: 3,   emoji: '🌱', label: 'First Sprout',    xp: 50  },
  { days: 7,   emoji: '🔥', label: 'Week Warrior',    xp: 100 },
  { days: 14,  emoji: '⚡', label: 'Two Week Streak',  xp: 200 },
  { days: 21,  emoji: '💪', label: '3-Week Habit',    xp: 300 },
  { days: 30,  emoji: '🏆', label: 'Month Master',    xp: 500 },
  { days: 60,  emoji: '🚀', label: '2 Month Rocket',  xp: 750 },
  { days: 100, emoji: '👑', label: 'Century Crown',   xp: 1000},
  { days: 365, emoji: '🌟', label: 'Year Legend',     xp: 5000},
]

export function getSessionDuration(totalDays) {
  if (totalDays < 30)  return 120
  if (totalDays < 60)  return 150
  if (totalDays < 90)  return 180
  if (totalDays < 120) return 210
  return 240
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000)
}

function computeHash(data) {
  const str = INTEGRITY_SEED + data
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return (hash >>> 0).toString(36)
}

const DEFAULT_STATE = {
  streak: 0,
  longestStreak: 0,
  totalDays: 0,
  lastCompletedDate: null,
  xp: 0,
  unlockedMilestones: [],
  history: [],
  newMilestone: null,
  weeklyDone: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const wrapper = JSON.parse(raw)
    if (!wrapper.d || !wrapper.h) return { ...DEFAULT_STATE, ...wrapper }
    const json = atob(wrapper.d)
    if (computeHash(json) !== wrapper.h) {
      console.warn('EnglishSpark: state integrity check failed, resetting.')
      localStorage.removeItem(STORAGE_KEY)
      return { ...DEFAULT_STATE }
    }
    return { ...DEFAULT_STATE, ...JSON.parse(json) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function saveState(state) {
  const json = JSON.stringify(state)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    d: btoa(json),
    h: computeHash(json),
  }))
}

export function getTodayStatus(state) {
  const today = todayStr()
  const entry = state.history.find(h => h.date === today)
  return {
    writingDone:  entry?.writingDone  ?? false,
    speakingDone: entry?.speakingDone ?? false,
    allDone:     (entry?.writingDone && entry?.speakingDone) ?? false,
  }
}

export function completeTask(taskType) {
  const state = loadState()
  const today = todayStr()

  let entry = state.history.find(h => h.date === today)
  if (!entry) {
    entry = { date: today, writingDone: false, speakingDone: false, xpEarned: 0 }
    state.history.push(entry)
  }

  const field = taskType === 'writing' ? 'writingDone' : 'speakingDone'
  if (entry[field]) { saveState(state); return state }
  entry[field] = true

  const xpGain = 25
  entry.xpEarned = (entry.xpEarned || 0) + xpGain
  state.xp += xpGain

  if (entry.writingDone || entry.speakingDone) {
    const last = state.lastCompletedDate
    if (last !== today) {
      const gap = last ? daysBetween(last, today) : 1
      state.streak = gap === 1 ? state.streak + 1 : 1
      state.lastCompletedDate = today
      state.totalDays += 1
      if (state.streak > state.longestStreak) state.longestStreak = state.streak

      state.xp += 25
      entry.xpEarned += 25

      const newMilestone = MILESTONES.find(
        m => m.days === state.streak && !state.unlockedMilestones.includes(m.days)
      )
      if (newMilestone) {
        state.unlockedMilestones.push(newMilestone.days)
        state.xp += newMilestone.xp
        entry.xpEarned += newMilestone.xp
        state.newMilestone = newMilestone
      }
    }
  }

  saveState(state)
  return state
}

// Save text + feedback + prompt for a completed task (called after feedback arrives)
export function saveTaskResult(date, taskType, { text, feedback, prompt }) {
  const state = loadState()
  const entry = state.history.find(h => h.date === date)
  if (!entry) return
  if (taskType === 'writing') {
    entry.writingText     = text
    entry.writingFeedback = feedback ?? null
    entry.writingPrompt   = prompt
  } else {
    entry.speakingText     = text
    entry.speakingFeedback = feedback ?? null
    entry.speakingPrompt   = prompt
  }
  saveState(state)
}

export function completeWeeklyChallenge(week) {
  const state = loadState()
  if ((state.weeklyDone || []).includes(week)) return state
  state.weeklyDone = [...(state.weeklyDone || []), week]
  state.xp += 50
  saveState(state)
  return state
}

export function clearNewMilestone() {
  const state = loadState()
  state.newMilestone = null
  saveState(state)
}

export function getLevel(xp) {
  const levels = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 7000]
  let level = 1
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) level = i + 1
    else break
  }
  const currentFloor = levels[Math.min(level - 1, levels.length - 1)]
  const nextCeil     = levels[Math.min(level,     levels.length - 1)]
  const progress = nextCeil > currentFloor
    ? ((xp - currentFloor) / (nextCeil - currentFloor)) * 100
    : 100
  return { level, progress: Math.min(progress, 100), nextXp: nextCeil, currentFloor }
}

export function getNextMilestone(streak, unlockedMilestones) {
  return MILESTONES.find(m => m.days > streak) || null
}
