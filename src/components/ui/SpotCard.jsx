import { useState } from 'react'
import { learnFor, lineFor } from '../../lib/line.js'
import { scoreKey } from '../../lib/road.js'
import { entrySyllables } from '../../lib/syllable.js'
import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'
import ListenButton from './ListenButton.jsx'
import Phrase from './Phrase.jsx'
import Picture from './Picture.jsx'
import SpeakPractice from './SpeakPractice.jsx'
import ToneLegend from './ToneLegend.jsx'

// The word for a thing in town the player walked up to (see
// data/townSpots.js): read it in the language being learned, listen, then
// say it for a score. Give it key={spot.id}.
export default function SpotCard({ spot, onClose }) {
  const gender = useGameStore((s) => s.gender)
  const learn = learnFor(useGameStore((s) => s.lang))
  const recordWord = useGameStore((s) => s.recordWord)
  const [round, setRound] = useState(0)
  const { entry } = spot

  return (
    <div className="panel spot-card">
      <button type="button" className="btn btn-ghost btn-round spot-close" onClick={onClose} aria-label="close">
        ✕
      </button>
      <Picture text={entry.emoji} className="spot-emoji" />
      <Phrase line={lineFor(entry, learn, gender)} size="lg" />
      {learn === 'th' && <ToneLegend syllables={entrySyllables(entry, gender)} />}
      <div className="row">
        <ListenButton entry={entry} learn={learn} />
        <button type="button" className="btn" onClick={() => setRound(round + 1)}>
          🔄 <Label k="tryAgain" />
        </button>
      </div>
      <SpeakPractice
        key={round}
        entry={entry}
        learn={learn}
        onScored={(score) => score > 0 && recordWord(scoreKey(learn, entry.id), score)}
      />
    </div>
  )
}
