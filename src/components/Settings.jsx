import { useState } from 'react'
import { getApiKey, saveApiKey } from '../api'

export default function Settings({ onBack }) {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveApiKey(key)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <div className="task-header accent-purple">
        <span className="task-icon">⚙️</span>
        <div>
          <h2>Settings</h2>
          <p className="task-subtitle">Anthropic API key for feedback</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">How to get a free API key</div>
        <ol className="settings-steps">
          <li>Go to <strong>console.anthropic.com</strong></li>
          <li>Create a free account</li>
          <li>Go to <strong>API Keys</strong> → create new key</li>
          <li>Paste it below</li>
        </ol>
      </div>

      <div className="writing-area">
        <label className="input-label">Anthropic API Key</label>
        <input
          type="password"
          className="text-input"
          style={{ padding: '12px 14px', fontSize: '14px' }}
          placeholder="sk-ant-..."
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <p className="settings-note">Stored only in your browser. Never sent anywhere except Anthropic.</p>
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={!key.trim()}>
        {saved ? '✓ Saved!' : 'Save Key'}
      </button>
    </div>
  )
}
