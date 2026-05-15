import { useState } from 'react'
import { loadState } from '../habitStore'

export default function Settings({ onBack }) {
  const [exportDone, setExportDone] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  function handleExport() {
    const state = loadState()
    const synPerf = (() => { try { return JSON.parse(localStorage.getItem('syn_perf') || '{}') } catch { return {} } })()
    const data = { exportedAt: new Date().toISOString(), state, synPerf }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `englishspark-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 3000)
  }

  function handleReset() {
    localStorage.removeItem('english_habit_v1')
    localStorage.removeItem('syn_perf')
    window.location.reload()
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <div className="task-header accent-purple">
        <span className="task-icon">⚙️</span>
        <div>
          <h2>Settings</h2>
          <p className="task-subtitle">Data & configuration</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Your data</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', marginBottom: '12px' }}>
          All your progress is stored locally in this browser. Export a backup at any time.
        </p>
        <button className="btn-primary" onClick={handleExport} style={{ marginBottom: '8px' }}>
          {exportDone ? '✓ Downloaded!' : 'Export data (JSON)'}
        </button>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">How AI feedback works</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)' }}>
          AI feedback runs securely on the server — your API key is never stored in the browser.
          To enable it, add your Anthropic API key as an environment variable in your Vercel project.
        </p>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Setup steps</div>
        <ol className="settings-steps">
          <li>Go to <strong>vercel.com</strong> → your project → <strong>Settings → Environment Variables</strong></li>
          <li>Add variable: <strong>ANTHROPIC_API_KEY</strong> = your key</li>
          <li>Get a key at <strong>console.anthropic.com</strong> → API Keys</li>
          <li>Redeploy the project</li>
        </ol>
      </div>

      <div className="prompt-box">
        <div className="prompt-label" style={{ color: 'var(--danger, #e53e3e)' }}>Danger zone</div>
        {!resetConfirm ? (
          <button className="btn-danger" onClick={() => setResetConfirm(true)}>
            Reset all progress
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--danger, #e53e3e)', margin: 0 }}>
              This will delete all your streaks, XP, and history. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-danger" onClick={handleReset}>Yes, reset everything</button>
              <button className="btn-secondary" onClick={() => setResetConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
