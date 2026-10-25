import { useState } from 'react'
import Label from '../components/ui/Label.jsx'
import ListenButton from '../components/ui/ListenButton.jsx'
import Phrase from '../components/ui/Phrase.jsx'
import Picture from '../components/ui/Picture.jsx'
import SpeakPractice from '../components/ui/SpeakPractice.jsx'
import ToneLegend from '../components/ui/ToneLegend.jsx'
import { learnFor, lineFor } from '../lib/line.js'
import { scoreKey } from '../lib/road.js'
import { entrySyllables } from '../lib/syllable.js'
import { isPass } from '../speech/evaluateAttempt.js'
import { useGameStore } from '../store/useGameStore.js'

// Listen, then say it: one word at a time in the language being learned,
// scored 0–100. The counter shows the best score so far. `onStage` tells the
// zone's 3D scene which word is showing and how the person there reacts.
export default function SpeakMode({ words, onStage }) {
  const gender = useGameStore((s) => s.gender)
  const learn = learnFor(useGameStore((s) => s.lang))
  const wordScores = useGameStore((s) => s.wordScores)
  const recordWord = useGameStore((s) => s.recordWord)
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(0)
  const entry = words[index]
  const id = scoreKey(learn, entry.id)
  const best = wordScores[id]

  const move = (step) => {
    const next = (index + step + words.length) % words.length
    setIndex(next)
    onStage?.({ wordId: words[next].id, mood: 'idle' })
  }
  const scored = (score) => {
    if (score > 0) recordWord(id, score)
    onStage?.({ wordId: entry.id, mood: isPass(score) ? 'happy' : 'confused' })
  }

  return (
    <div className="mode mode-speak">
      <div className="card-counter">
        {index + 1} / {words.length}
        {best != null && <span className="best-score">🏅 {best}</span>}
      </div>
      <div className="panel speak-card">
        <Picture text={entry.icon} className="flashcard-icon small" />
        <Phrase key={entry.id} line={lineFor(entry, learn, gender)} size="lg" />
        {learn === 'th' && <ToneLegend syllables={entrySyllables(entry, gender)} />}
        <ListenButton entry={entry} learn={learn} />
      </div>
      <SpeakPractice
        key={`${entry.id}-${round}`}
        entry={entry}
        learn={learn}
        onScored={scored}
      />
      <div className="row">
        <button type="button" className="btn" onClick={() => move(-1)}>
          ◀ <Label k="prev" />
        </button>
        <button type="button" className="btn" onClick={() => setRound(round + 1)}>
          🔄 <Label k="tryAgain" />
        </button>
        <button type="button" className="btn btn-primary" onClick={() => move(1)}>
          <Label k="next" /> ▶
        </button>
      </div>
    </div>
  )
}
