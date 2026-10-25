import { useState } from 'react'
import { TONES } from '../../data/tones.js'
import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'

// A line in the language being learned (Thai syllables in their tone colors,
// or Burmese), with its meaning in the player's language. The reading help
// card shows how to say it in the player's own script (Thai written in
// Burmese letters, or Burmese in Thai letters); it stays closed until tapped,
// so players try listening first (unless the autoHint setting or
// `hintAtStart` opens it). `hint={false}` leaves the card out.
// `line` comes from lineFor() in lib/line.js.
export default function Phrase({ line, size = 'md', showMeaning = true, hint = true, hintAtStart = false }) {
  const settings = useGameStore((s) => s.settings)
  const [hintOpen, setHintOpen] = useState(Boolean(settings.autoHint || hintAtStart))
  const own = line.lang === 'th' ? 'my' : 'th'

  return (
    <div className={`phrase phrase-${size}`}>
      <div className={`phrase-text phrase-text-${line.lang}`} lang={line.lang}>
        {line.syllables
          ? line.syllables.map((s, i) => (
              <span key={i} style={{ color: TONES[s.tone].color }} title={TONES[s.tone].th}>
                {s.th}
              </span>
            ))
          : line.text}
      </div>
      {showMeaning && settings.showTranslation && (
        <div className="word-meaning" lang={own}>
          {line.meaning}
        </div>
      )}
      {hint && (
        <button
          type="button"
          className={`btn btn-hint ${hintOpen ? 'is-open' : ''}`}
          aria-expanded={hintOpen}
          onClick={(e) => {
            e.stopPropagation()
            setHintOpen(!hintOpen)
          }}
        >
          💡 <Label k="readingHelp" />
        </button>
      )}
      {hint && hintOpen && (
        <div className="hint-card">
          <div className="hint-reading" lang={own}>
            {line.reading}
          </div>
        </div>
      )}
    </div>
  )
}
