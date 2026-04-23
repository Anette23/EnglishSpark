import { MILESTONES, getLevel, getNextMilestone, getSessionDuration, formatDuration } from '../habitStore'

export default function Dashboard({ state, todayStatus, onStartTask }) {
  const { streak, longestStreak, totalDays, xp, unlockedMilestones } = state
  const { level, progress, nextXp, currentFloor } = getLevel(xp)
  const nextMilestone = getNextMilestone(streak, unlockedMilestones)
  const duration = getSessionDuration(totalDays)

  const streakMilestoneProgress = nextMilestone
    ? ((streak / nextMilestone.days) * 100)
    : 100

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <h1>English Habit <span className="spark">⚡</span></h1>
        <p className="dash-subtitle">2-minute daily English practice</p>
      </div>

      {/* Streak card */}
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

      {/* XP / Level */}
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

      {/* Today's tasks */}
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

        {todayStatus.allDone && (
          <div className="all-done-banner">
            🎉 Both tasks done for today! See you tomorrow!
          </div>
        )}
      </div>

      {/* Milestones */}
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

      {/* Stats */}
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
