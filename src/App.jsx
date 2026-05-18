import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TaskSession from './components/TaskSession'
import MilestoneModal from './components/MilestoneModal'
import Settings from './components/Settings'
import HistoryView from './components/HistoryView'
import BonusSession from './components/BonusSession'
import MixedSession from './components/MixedSession'
import WeeklySession from './components/WeeklySession'
import ChatSession from './components/ChatSession'
import VocabularyView from './components/VocabularyView'
import ReadingSession from './components/ReadingSession'
import { loadState, getTodayStatus, completeTask, getSessionDuration, completeWeeklyChallenge, clearNewMilestone, clearNewLevel, useStreakFreeze, getStreakFreezes } from './habitStore'
import { getCurrentChallenge } from './weeklyChallenge'

function LevelUpModal({ level, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="milestone-modal" onClick={e => e.stopPropagation()}>
        <div className="milestone-emoji">⭐</div>
        <div className="milestone-badge">LEVEL UP!</div>
        <h2 className="milestone-name">Level {level}</h2>
        <p className="milestone-days">You're getting better every day!</p>
        <div className="confetti">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              backgroundColor: ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6'][i % 5]
            }} />
          ))}
        </div>
        <button className="btn-primary" onClick={onClose}>Let's keep going! 🚀</button>
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [view, setView]   = useState('dashboard')
  const [showMilestone, setShowMilestone] = useState(null)
  const [showLevelUp, setShowLevelUp]     = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => { window.scrollTo(0, 0) }, [view])

  // Push a history entry when leaving dashboard so hardware back button works
  useEffect(() => {
    if (view !== 'dashboard') {
      window.history.pushState({ view }, '')
    }
  }, [view])

  // Handle hardware/browser back button — return to dashboard instead of exiting
  useEffect(() => {
    function onPopState() {
      setView('dashboard')
      setState(loadState())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const duration = getSessionDuration(state.totalDays)

  function handleCompleteTask(taskType) {
    const newState = completeTask(taskType)
    setState({ ...newState })
    if (newState.newMilestone) setShowMilestone(newState.newMilestone)
    if (newState.newLevel)     setShowLevelUp(newState.newLevel)
  }

  function handleBack() {
    setView('dashboard')
    setState(loadState())
  }

  function handleFreezeStreak() {
    const newState = useStreakFreeze()
    setState({ ...newState })
  }

  return (
    <div className="app">
      {view === 'dashboard' && (
        <Dashboard
          state={state}
          todayStatus={getTodayStatus(state)}
          onStartTask={setView}
          onOpenSettings={() => setView('settings')}
          onOpenHistory={() => setView('history')}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
          freezesAvailable={getStreakFreezes(state)}
          onFreezeStreak={handleFreezeStreak}
        />
      )}
      {(view === 'writing' || view === 'speaking') && (
        <TaskSession
          taskType={view}
          duration={duration}
          onComplete={() => handleCompleteTask(view)}
          onBack={handleBack}
        />
      )}
      {view === 'settings' && <Settings onBack={handleBack} />}
      {view === 'history'  && <HistoryView state={state} onBack={handleBack} />}
      {(view === 'synonyms' || view === 'prepositions' || view === 'idioms' || view === 'shadowing' || view === 'grammar') && (
        <BonusSession type={view} onBack={handleBack} />
      )}
      {view === 'chat'       && <ChatSession onBack={handleBack} />}
      {view === 'mixed'      && <MixedSession onBack={handleBack} />}
      {view === 'vocabulary' && <VocabularyView onBack={handleBack} />}
      {view === 'reading'    && <ReadingSession onBack={handleBack} />}
      {view === 'weekly' && (
        <WeeklySession
          challenge={getCurrentChallenge()}
          onComplete={() => { const s = completeWeeklyChallenge(getCurrentChallenge().weekKey); setState({ ...s }) }}
          onBack={handleBack}
        />
      )}
      {showMilestone && (
        <MilestoneModal
          milestone={showMilestone}
          onClose={() => { setShowMilestone(null); clearNewMilestone() }}
        />
      )}
      {showLevelUp && !showMilestone && (
        <LevelUpModal
          level={showLevelUp}
          onClose={() => { setShowLevelUp(null); clearNewLevel() }}
        />
      )}
    </div>
  )
}
