import { useState } from 'react'
import { speakLine } from '../../lib/speakEntry.js'
import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'

// Plays an entry in the language being learned (`learn`, Thai by default).
// `speaker` picks the polite particle for a line said by someone other than
// the player. Says so when the line has no sound (no Burmese recording yet).
export default function ListenButton({ entry, compact = false, label = 'listen', speaker, learn = 'th' }) {
  const playerGender = useGameStore((s) => s.gender)
  const gender = speaker ?? playerGender
  const settings = useGameStore((s) => s.settings)
  const [playing, setPlaying] = useState(false)
  const [silent, setSilent] = useState(false)

  const play = async (e) => {
    e.stopPropagation()
    setPlaying(true)
    const played = await speakLine(entry, learn, gender, settings)
    setPlaying(false)
    setSilent(!played)
  }

  return (
    <span className="listen-wrap">
      <button type="button" className={`btn btn-listen ${playing ? 'is-playing' : ''}`} onClick={play}>
        <span className="btn-icon">{silent ? '🔇' : '🔊'}</span>
        {!compact && <Label k={label} />}
      </button>
      {silent && !compact && <Label k="noSound" className="notice-small" />}
    </span>
  )
}
