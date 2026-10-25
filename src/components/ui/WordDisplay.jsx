import { TONES } from '../../data/tones.js'
import { entrySyllables, entryTranslation, joinMy } from '../../lib/syllable.js'
import { useGameStore } from '../../store/useGameStore.js'

// A word or phrase in four lines: Thai (each syllable in its tone color),
// reading in Burmese script, Burmese meaning.
// Which reading lines show is up to the player's settings. `speaker` picks
// the polite particle for lines said by an NPC instead of the player.
export default function WordDisplay({ entry, size = 'md', showMeaning = true, showReadings = true, speaker }) {
  const playerGender = useGameStore((s) => s.gender)
  const gender = speaker ?? playerGender
  const settings = useGameStore((s) => s.settings)
  const syllables = entrySyllables(entry, gender)

  return (
    <div className={`word-display word-${size}`}>
      <div className="word-thai" lang="th">
        {syllables.map((s, i) => (
          <span key={i} style={{ color: TONES[s.tone].color }} title={TONES[s.tone].th}>
            {s.th}
          </span>
        ))}
      </div>
      {showReadings && settings.showMyReading && (
        <div className="word-reading-my" lang="my">
          {joinMy(syllables)}
        </div>
      )}
      {showMeaning && settings.showTranslation && (
        <div className="word-meaning" lang="my">
          {entryTranslation(entry, gender)}
        </div>
      )}
    </div>
  )
}
