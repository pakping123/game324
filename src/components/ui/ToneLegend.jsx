import { TONES } from '../../data/tones.js'

// The tones used by `syllables`, each with its color, arrow and name.
export default function ToneLegend({ syllables }) {
  const used = [...new Set(syllables.map((s) => s.tone))]
  return (
    <div className="tone-legend">
      {used.map((tone) => (
        <span key={tone} className="tone-chip" style={{ '--tone': TONES[tone].color }}>
          {TONES[tone].arrow} {TONES[tone].my} · {TONES[tone].th}
        </span>
      ))}
    </div>
  )
}
