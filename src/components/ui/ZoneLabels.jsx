import { UI } from '../../data/ui.js'
import { ZONES } from '../../data/zones.js'
import { useGameStore } from '../../store/useGameStore.js'

// Zone name tags laid over the town canvas. Town's LabelTracker positions
// them each frame through `labelRefs`. Names show in the player's language
// first.
export default function ZoneLabels({ labelRefs, onSelect }) {
  const lang = useGameStore((s) => s.lang) ?? 'my'
  const other = lang === 'th' ? 'my' : 'th'
  return (
    <div className="zone-labels">
      {ZONES.map((zone) => (
        <button
          key={zone.id}
          ref={(el) => {
            labelRefs.current[zone.id] = el
          }}
          type="button"
          className={`zone-tag ${zone.ready ? '' : 'is-locked'}`}
          style={{ '--zone': zone.color, visibility: 'hidden' }}
          onClick={() => onSelect(zone)}
        >
          <span className="zone-tag-icon">{zone.ready ? zone.icon : '🔒'}</span>
          <span className="zone-tag-main" lang={lang}>{zone[lang]}</span>
          <span className="zone-tag-sub" lang={other}>{zone[other]}</span>
          {!zone.ready && <span className="zone-tag-soon">{UI.comingSoon[lang]}</span>}
        </button>
      ))}
    </div>
  )
}
