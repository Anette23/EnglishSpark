import { MILESTONES, getLevel, getNextMilestone, getSessionDuration, formatDuration } from '../habitStore'
import { getCurrentChallenge, isWeeklyChallengeComplete } from '../weeklyChallenge'

export default function Dashboard({ state, todayStatus, onStartTask, onOpenSettings, onOpenHistory, darkMode, onToggleDark }) {
  const { streak, longestStreak, totalDays, xp, unlockedMilestones } = state
  const { level, progress, nextXp, currentFloor } = getLevel(xp)
  const nextMilestone = getNextMilestone(streak, unlockedMilestones)
  const duration = getSessionDuration(totalDays)

  const weeklyChallenge = getCurrentChallenge()
  const weeklyDone      = isWeeklyChallengeComplete(state)

  const streakMilestoneProgress = nextMilestone
    ? ((streak / nextMilestone.days) * 100)
    : 100

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>EnglishSpark <span className="spark">⚡</span></h1>
          <p className="dash-subtitle">2-minute daily English practice</p>
        </div>
        <div className="dash-header-actions">
          <button className="btn-settings" onClick={onToggleDark} title="Toggle dark mode">{darkMode ? '☀️' : '🌙'}</button>
          <button className="btn-settings" onClick={onOpenHistory} title="History">📚</button>
          <button className="btn-settings" onClick={onOpenSettings} title="Settings">⚙️</button>
        </div>
      </div>

      <div className="dash-columns">
        {/* Left column: progress & stats */}
        <div className="dash-left">
          <div className="streak-card">
            <div className="streak-flame">🔥</div>
            <div className="streak-number">{streak}</div>
            <div className="streak-label">day streak</div>
            <div className="streak-best">Best: {longestStreak} days</div>

            {nextMilestone && (
              <div className="milestone-progress">
                <div className="milestone-progress-label">
                  Next: {nextMilestone.emoji} {nextMilestone.label} ({nextMilestone.days} days)
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-streak"
                    style={{ width: `${Math.min(streakMilestoneProgress, 100)}%` }}
                  />
                </div>
                <div className="progress-text">{streak} / {nextMilestone.days}</div>
              </div>
            )}
          </div>

          <div className="xp-card">
            <div className="xp-left">
              <div className="level-badge">Lv {level}</div>
              <div className="xp-total">{xp} XP total</div>
            </div>
            <div className="xp-right">
              <div className="progress-bar">
                <div className="progress-fill progress-xp" style={{ width: `${progress}%` }} />
              </div>
              <div className="xp-label">{xp - currentFloor} / {nextXp - currentFloor} to level {level + 1}</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">{totalDays}</div>
              <div className="stat-label">Days completed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{unlockedMilestones.length}</div>
              <div className="stat-label">Milestones</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{formatDuration(duration)}</div>
              <div className="stat-label">Session length</div>
            </div>
          </div>

          <ActivityGraph history={state.history} />

          <div className="milestones-section">
            <h3>Milestones</h3>
            <div className="milestones-grid">
              {MILESTONES.map(m => {
                const unlocked = unlockedMilestones.includes(m.days)
                return (
                  <div key={m.days} className={`milestone-chip ${unlocked ? 'unlocked' : 'locked'}`}>
                    <span className="m-emoji">{unlocked ? m.emoji : '🔒'}</span>
                    <span className="m-label">{m.label}</span>
                    <span className="m-days">{m.days}d</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: today's tasks & bonus */}
        <div className="dash-right">
          <div className="today-section">
            <h3>Today's Challenge <span className="duration-badge">{formatDuration(duration)} each</span></h3>
            <div className="tasks-grid">
              <TaskCard
                icon="✍️"
                title="Writing"
                desc="Write in English for the prompt of the day"
                done={todayStatus.writingDone}
                color="purple"
                onStart={() => onStartTask('writing')}
              />
              <TaskCard
                icon="🎤"
                title="Speaking"
                desc="Speak out loud about the prompt of the day"
                done={todayStatus.speakingDone}
                color="green"
                onStart={() => onStartTask('speaking')}
              />
            </div>

            {todayStatus.writingDone && todayStatus.speakingDone ? (
              <div className="all-done-banner">
                🎉 Both tasks done for today! See you tomorrow!
              </div>
            ) : (todayStatus.writingDone || todayStatus.speakingDone) ? (
              <div className="streak-done-banner">
                🔥 Streak secured! Complete the other task for extra XP.
              </div>
            ) : null}
          </div>

          <div className={`weekly-card ${weeklyDone ? 'weekly-done' : ''}`}>
            <div className="weekly-top">
              <span className="weekly-icon">🏆</span>
              <div>
                <div className="weekly-label">Weekly Challenge</div>
                <div className="weekly-title">{weeklyChallenge.title}</div>
              </div>
              {weeklyDone && <div className="weekly-badge">Done!</div>}
            </div>
            <p className="weekly-prompt">{weeklyChallenge.prompt}</p>
            {!weeklyDone && (
              <button className="btn-weekly-start" onClick={() => onStartTask('weekly')}>
                Start Challenge +50 XP
              </button>
            )}
          </div>

          <div className="bonus-section">
            <h3>Extra Practice</h3>
            <p className="bonus-note">Optional — not required for streak</p>
            <div className="tasks-grid">
              <BonusCard
                icon="🔤" title="Synonyms"
                desc="Find synonyms for today's word"
                color="blue" onStart={() => onStartTask('synonyms')}
              />
              <BonusCard
                icon="📝" title="Prepositions"
                desc="Fill in the missing preposition"
                color="orange" onStart={() => onStartTask('prepositions')}
              />
              <BonusCard
                icon="💬" title="Idioms"
                desc="Fill in the missing word in an idiom"
                color="purple" onStart={() => onStartTask('idioms')}
              />
              <BonusCard
                icon="🎧" title="Shadowing"
                desc="Listen and repeat a sentence"
                color="teal" onStart={() => onStartTask('shadowing')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityGraph({ history }) {
  const DAYS = 30
  const today = new Date()
  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (DAYS - 1 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const entry = history.find(h => h.date === dateStr)
    const cls = !entry                                      ? 'cal-empty'
              : entry.writingDone && entry.speakingDone     ? 'cal-full'
              : (entry.writingDone || entry.speakingDone)   ? 'cal-half'
              : 'cal-empty'
    const day = d.getDate()
    return { dateStr, cls, day }
  })

  return (
    <div className="activity-graph">
      <div className="activity-label">Last 30 days</div>
      <div className="activity-grid">
        {cells.map(({ dateStr, cls, day }) => (
          <div key={dateStr} className={`act-dot ${cls}`} title={dateStr}>
            <span className="act-day">{day}</span>
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span className="cal-legend-dot" style={{ background: 'var(--green)' }} />both
        <span className="cal-legend-dot" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }} />one
        <span className="cal-legend-dot" style={{ background: 'var(--border)' }} />none
      </div>
    </div>
  )
}

function BonusCard({ icon, title, desc, color, onStart }) {
  return (
    <div className={`task-card task-card-${color}`}>
      <div className="task-card-icon">{icon}</div>
      <div className="task-card-body">
        <div className="task-card-title">{title}</div>
        <div className="task-card-desc">{desc}</div>
      </div>
      <button className={`btn-task btn-task-${color}`} onClick={onStart}>Start</button>
    </div>
  )
}

function TaskCard({ icon, title, desc, done, color, onStart }) {
  return (
    <div className={`task-card task-card-${color} ${done ? 'task-done' : ''}`}>
      <div className="task-card-icon">{done ? '✅' : icon}</div>
      <div className="task-card-body">
        <div className="task-card-title">{title}</div>
        <div className="task-card-desc">{desc}</div>
      </div>
      {done
        ? <div className="task-card-complete">Done!</div>
        : <button className={`btn-task btn-task-${color}`} onClick={onStart}>Start</button>
      }
    </div>
  )
}
