export default function Settings({ onBack }) {
  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <div className="task-header accent-purple">
        <span className="task-icon">⚙️</span>
        <div>
          <h2>Settings</h2>
          <p className="task-subtitle">AI feedback configuration</p>
        </div>
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
    </div>
  )
}
