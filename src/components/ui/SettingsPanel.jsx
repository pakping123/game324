import { useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'

// The Burmese-script reading only shows in the town's Thai lessons, which
// are for Burmese players.
const TOGGLES = {
  my: ['autoHint', 'showMyReading', 'showTranslation', 'slowSpeech'],
  th: ['autoHint', 'showTranslation', 'slowSpeech'],
}

const LANGS = [
  { lang: 'my', label: '🇲🇲 မြန်မာ' },
  { lang: 'th', label: '🇹🇭 ไทย' },
]

export default function SettingsPanel({ onClose }) {
  const settings = useGameStore((s) => s.settings)
  const lang = useGameStore((s) => s.lang) ?? 'my'
  const setLang = useGameStore((s) => s.setLang)
  const toggleSetting = useGameStore((s) => s.toggleSetting)
  const goHome = useGameStore((s) => s.goHome)
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal" onClick={(e) => e.stopPropagation()}>
        <h2>⚙️ <Label k="settings" /></h2>
        <div className="setting-lang">
          <Label k="language" />
          <div className="row">
            {LANGS.map((l) => (
              <button
                key={l.lang}
                type="button"
                className={`btn ${lang === l.lang ? 'btn-primary' : ''}`}
                aria-pressed={lang === l.lang}
                onClick={() => setLang(l.lang)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        {TOGGLES[lang].map((key) => (
          <label key={key} className="toggle">
            <input type="checkbox" checked={Boolean(settings[key])} onChange={() => toggleSetting(key)} />
            <Label k={key} />
          </label>
        ))}
        <button type="button" className="btn" onClick={goHome}>
          🏠 <Label k="home" />
        </button>
        <p className="credit">
          <Label k="pictureCredit" />
        </p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          <Label k="close" />
        </button>
      </div>
    </div>
  )
}
