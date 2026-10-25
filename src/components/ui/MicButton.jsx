import Label from './Label.jsx'

// Big round microphone button. Tap to start; tap again to finish early.
export default function MicButton({ status, onStart, onStop }) {
  const listening = status === 'listening'
  return (
    <div className="mic-wrap">
      <button
        type="button"
        className={`mic-button ${listening ? 'is-listening' : ''}`}
        onClick={listening ? onStop : onStart}
        aria-pressed={listening}
      >
        🎤
      </button>
      <Label k={listening ? 'listening' : 'tapMic'} className="mic-label" />
    </div>
  )
}
