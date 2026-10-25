import { UI } from '../../data/ui.js'
import { useGameStore } from '../../store/useGameStore.js'

// Text in the player's own language with the other language underneath
// (Burmese first until a language is chosen).
export default function Label({ k, text = UI[k], className = '' }) {
  const lang = useGameStore((s) => s.lang) ?? 'my'
  const other = lang === 'th' ? 'my' : 'th'
  return (
    <span className={`label ${className}`}>
      <span className="label-main" lang={lang}>{text[lang]}</span>
      <span className="label-sub" lang={other}>{text[other]}</span>
    </span>
  )
}
