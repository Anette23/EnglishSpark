import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TaskSession from './components/TaskSession'
import MilestoneModal from './components/MilestoneModal'
import { loadState, getTodayStatus, completeTask, getSessionDuration } from './habitStore'

export default function App() {
  const [state, setState] = useState(() => loadState())
  const [view, setView] = useState('dashboard') // 'dashboard' | 'writing' | 'speaking'
  const [showMilestone, setShowMilestone] = useState(null)

  const todayStatus = getTodayStatus(state)
  const duration = getSessionDuration(state.totalDays)

  function handleStartTask(taskType) {
    setView(taskType)
  }

  function handleCompleteTask(taskType) {
    const newState = completeTask(taskType)
    setState({ ...newState })
    if (newState.newMilestone) {
      setShowMilestone(newState.newMilestone)
    }
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
          onStartTask={handleStartTask}
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
      {showMilestone && (
        <MilestoneModal
          milestone={showMilestone}
          onClose={() => setShowMilestone(null)}
        />
      )}
    </div>
  )
}
