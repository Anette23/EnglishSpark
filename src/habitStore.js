const STORAGE_KEY = 'english_habit_v1'

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

// Session duration in seconds based on total days completed
export function getSessionDuration(totalDays) {
  if (totalDays < 30)  return 120   // 2:00
  if (totalDays < 60)  return 150   // 2:30
  if (totalDays < 90)  return 180   // 3:00
  if (totalDays < 120) return 210   // 3:30
  return 240                        // 4:00
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a, b) {
  const msPerDay = 86400000
  return Math.round((new Date(b) - new Date(a)) / msPerDay)
}

const DEFAULT_STATE = {
  streak: 0,
  longestStreak: 0,
  totalDays: 0,
  lastCompletedDate: null,
  xp: 0,
  unlockedMilestones: [],
  history: [],        // [{date, writingDone, speakingDone, xpEarned}]
  newMilestone: null, // milestone just earned (cleared after shown)
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getTodayStatus(state) {
  const today = todayStr()
  const entry = state.history.find(h => h.date === today)
  return {
    writingDone: entry?.writingDone ?? false,
    speakingDone: entry?.speakingDone ?? false,
    allDone: (entry?.writingDone && entry?.speakingDone) ?? false,
  }
}

export function completeTask(taskType) {
  // taskType: 'writing' | 'speaking'
  const state = loadState()
  const today = todayStr()

  let entry = state.history.find(h => h.date === today)
  if (!entry) {
    entry = { date: today, writingDone: false, speakingDone: false, xpEarned: 0 }
    state.history.push(entry)
  }

  const field = taskType === 'writing' ? 'writingDone' : 'speakingDone'
  if (entry[field]) {
    saveState(state)
    return state // already done
  }
  entry[field] = true

  const xpGain = 25
  entry.xpEarned = (entry.xpEarned || 0) + xpGain
  state.xp += xpGain

  // If both tasks done today and this is a new day
  if (entry.writingDone && entry.speakingDone) {
    const last = state.lastCompletedDate
    if (last !== today) {
      const gap = last ? daysBetween(last, today) : 1
      if (gap === 1) {
        state.streak += 1
      } else if (gap > 1) {
        state.streak = 1
      }
      state.lastCompletedDate = today
      state.totalDays += 1
      if (state.streak > state.longestStreak) {
        state.longestStreak = state.streak
      }

      // Bonus XP for completing both
      state.xp += 25
      entry.xpEarned += 25

      // Check milestones
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
  const nextCeil = levels[Math.min(level, levels.length - 1)]
  const progress = nextCeil > currentFloor
    ? ((xp - currentFloor) / (nextCeil - currentFloor)) * 100
    : 100
  return { level, progress: Math.min(progress, 100), nextXp: nextCeil, currentFloor }
}

export function getNextMilestone(streak, unlockedMilestones) {
  return MILESTONES.find(m => m.days > streak) || null
}
