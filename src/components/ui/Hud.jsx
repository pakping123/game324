import { useState } from 'react'
import { passedCount, useGameStore } from '../../store/useGameStore.js'
import Label from './Label.jsx'
import SettingsPanel from './SettingsPanel.jsx'

// Top bar: optional back (or "go to") button, how many words the player has
// passed, coins, then the start screen, the wardrobe, the AI chat and
// settings.
export default function Hud({ title, onBack, backIcon = '◀', backLabel = 'back' }) {
  const passed = useGameStore(passedCount)
  const coins = useGameStore((s) => s.coins)
  const openScene = useGameStore((s) => s.openScene)
  const goHome = useGameStore((s) => s.goHome)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header className="hud">
      {onBack ? (
        <button type="button" className="btn btn-hud" onClick={onBack}>
          {backIcon} <Label k={backLabel} />
        </button>
      ) : (
        <span />
      )}
      {title && <div className="hud-title">{title}</div>}
      <div className="hud-right">
        <span className="hud-pill" title="ผ่านแล้ว">🗣️ {passed}</span>
        <span className="hud-pill">🪙 {coins}</span>
        <button
          type="button"
          className="btn btn-hud btn-round"
          onClick={goHome}
          aria-label="start screen"
          title="หน้าเริ่มต้น"
        >
          🏠
        </button>
        <button
          type="button"
          className="btn btn-hud btn-round"
          onClick={() => openScene('wardrobe')}
          aria-label="wardrobe"
          title="แต่งตัว"
        >
          👕
        </button>
        <button
          type="button"
          className="btn btn-hud btn-round"
          onClick={() => openScene('chat')}
          aria-label="AI chat"
          title="คุยกับ AI"
        >
          🤖
        </button>
        <button
          type="button"
          className="btn btn-hud btn-round"
          onClick={() => setSettingsOpen(true)}
          aria-label="settings"
        >
          ⚙️
        </button>
      </div>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </header>
  )
}
