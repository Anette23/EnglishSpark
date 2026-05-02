import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TaskSession from './components/TaskSession'
import MilestoneModal from './components/MilestoneModal'
import Settings from './components/Settings'
import HistoryView from './components/HistoryView'
import BonusSession from './components/BonusSession'
import WeeklySession from './components/WeeklySession'
import ChatSession from './components/ChatSession'
import { loadState, getTodayStatus, completeTask, getSessionDuration, completeWeeklyChallenge, clearNewMilestone } from './habitStore'
import { getCurrentChallenge } from './weeklyChallenge'

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [view, setView]   = useState('dashboard')
  const [showMilestone, setShowMilestone] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const duration = getSessionDuration(state.totalDays)

  function handleCompleteTask(taskType) {
    const newState = completeTask(taskType)
    setState({ ...newState })
    if (newState.newMilestone) setShowMilestone(newState.newMilestone)
  }

  function handleBack() {
    setView('dashboard')
    setState(loadState())
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
      {(view === 'synonyms' || view === 'prepositions' || view === 'idioms' || view === 'shadowing') && (
        <BonusSession type={view} onBack={handleBack} />
      )}
      {view === 'chat' && <ChatSession onBack={handleBack} />}
      {view === 'weekly' && (
        <WeeklySession
          challenge={getCurrentChallenge()}
          onComplete={() => { const s = completeWeeklyChallenge(getCurrentChallenge().week); setState({ ...s }) }}
          onBack={handleBack}
        />
      )}
      {showMilestone && (
        <MilestoneModal
          milestone={showMilestone}
          onClose={() => { setShowMilestone(null); clearNewMilestone() }}
        />
      )}
    </div>
  )
}
