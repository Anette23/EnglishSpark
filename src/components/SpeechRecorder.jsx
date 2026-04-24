import { useState, useRef, useEffect } from 'react'

export default function SpeechRecorder({ onTranscript, disabled }) {
  const [isRecording, setIsRecording]   = useState(false)
  const [transcript, setTranscript]     = useState('')
  const [interimText, setInterimText]   = useState('')
  const [supported, setSupported]       = useState(null) // null = not yet checked
  const [error, setError]               = useState(null)
  const recognitionRef = useRef(null)
  const finalRef = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    setSupported(true)

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let final = ''
      let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      finalRef.current = final
      setTranscript(final)
      setInterimText(interim)
      onTranscript(final + interim)
    }

    rec.onerror = (e) => {
      if (e.error === 'not-allowed') setError('Microphone permission denied.')
      else if (e.error !== 'aborted') setError('Recording error. Try again.')
      setIsRecording(false)
    }

    rec.onend = () => {
      setIsRecording(false)
      setInterimText('')
    }

    recognitionRef.current = rec
    return () => rec.abort()
  }, [])

  function toggleRecording() {
    const rec = recognitionRef.current
    if (!rec) return
    setError(null)
    if (isRecording) {
      rec.stop()
    } else {
      finalRef.current = ''
      setTranscript('')
      setInterimText('')
      onTranscript('')
      try { rec.start(); setIsRecording(true) }
      catch { setError('Could not start recording. Try again.') }
    }
  }

  if (supported === false) return null // browser doesn't support — silent fallback to text area

  return (
    <div className="speech-recorder">
      <button
        className={`btn-record ${isRecording ? 'btn-recording' : ''}`}
        onClick={toggleRecording}
        disabled={disabled}
        type="button"
      >
        {isRecording ? '⏹ Stop recording' : '🎙 Record my voice'}
      </button>

      {isRecording && (
        <div className="recording-indicator">
          <span className="rec-dot" /> Listening...
        </div>
      )}

      {error && <p className="rec-error">{error}</p>}

      {(transcript || interimText) && (
        <div className="transcript-box">
          <div className="transcript-label">Live transcript</div>
          <p className="transcript-text">
            {transcript}
            {interimText && <span className="interim">{interimText}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
