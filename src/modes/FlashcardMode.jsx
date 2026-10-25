import { useState } from 'react'
import Label from '../components/ui/Label.jsx'
import ListenButton from '../components/ui/ListenButton.jsx'
import Phrase from '../components/ui/Phrase.jsx'
import Picture from '../components/ui/Picture.jsx'
import ToneLegend from '../components/ui/ToneLegend.jsx'
import { learnFor, lineFor } from '../lib/line.js'
import { speakLine } from '../lib/speakEntry.js'
import { entrySyllables } from '../lib/syllable.js'
import { useGameStore } from '../store/useGameStore.js'

// Flip cards in the language being learned: the front shows the picture and
// the word, the back its reading and meaning. Flipping to the back says the
// word aloud. `onStage` tells the zone's 3D scene which word is showing and
// how the person there reacts.
export default function FlashcardMode({ words, onStage }) {
  const gender = useGameStore((s) => s.gender)
  const learn = learnFor(useGameStore((s) => s.lang))
  const settings = useGameStore((s) => s.settings)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const entry = words[index]
  const line = lineFor(entry, learn, gender)

  const flip = () => {
    if (!flipped) {
      speakLine(entry, learn, gender, settings)
      onStage?.({ wordId: entry.id, mood: 'talking' })
    }
    setFlipped(!flipped)
  }
  const move = (step) => {
    const next = (index + step + words.length) % words.length
    setIndex(next)
    setFlipped(false)
    onStage?.({ wordId: words[next].id, mood: 'idle' })
  }

  return (
    <div className="mode mode-cards">
      <div className="card-counter">
        {index + 1} / {words.length}
      </div>
      {/* A div, not a button: the back face holds its own buttons. */}
      <div
        role="button"
        tabIndex={0}
        className={`flashcard ${flipped ? 'is-flipped' : ''}`}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
        aria-label={line.text}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <Picture text={entry.icon} className="flashcard-icon" />
            <Phrase line={line} size="lg" showMeaning={false} hint={false} />
            <Label k="tapToFlip" className="flashcard-hint" />
          </div>
          <div className="flashcard-face flashcard-back">
            <Picture text={entry.icon} className="flashcard-icon small" />
            {/* Remount per card, so the reading starts open on each one. */}
            <Phrase key={entry.id} line={line} size="lg" hintAtStart />
            {learn === 'th' && <ToneLegend syllables={entrySyllables(entry, gender)} />}
            <ListenButton entry={entry} learn={learn} />
          </div>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => move(-1)}>
          ◀ <Label k="prev" />
        </button>
        <button type="button" className="btn btn-primary" onClick={() => move(1)}>
          <Label k="next" /> ▶
        </button>
      </div>
    </div>
  )
}
