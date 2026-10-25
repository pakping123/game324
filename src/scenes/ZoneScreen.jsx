import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import LookAt from '../components/three/LookAt.jsx'
import ZoneScene from '../components/three/ZoneScenes.jsx'
import Hud from '../components/ui/Hud.jsx'
import Label from '../components/ui/Label.jsx'
import Picture from '../components/ui/Picture.jsx'
import { zoneById } from '../data/zones.js'
import { learnFor } from '../lib/line.js'
import FlashcardMode from '../modes/FlashcardMode.jsx'
import PayGame from '../modes/PayGame.jsx'
import SpeakMode from '../modes/SpeakMode.jsx'
import { useGameStore } from '../store/useGameStore.js'

// Practice modes every zone has, plus each zone's own mini-game (for Burmese
// players only: the pay game is about Thai money).
const MODES = [
  { id: 'cards', label: 'modeCards', icon: '🃏' },
  { id: 'speak', label: 'modeSpeak', icon: '🎤' },
]
const ZONE_GAMES = {
  market: { id: 'pay', label: 'modePay', icon: '💸' },
}
// How long the person in the scene keeps reacting before standing still
// again (the pay game sets its own moods).
const MOOD_MS = 2500

// What the 3D scene shows when a mode starts: the first word of a word mode.
function startStage(mode, words) {
  return { wordId: mode === 'pay' ? null : words[0].id, mood: 'idle' }
}

export default function ZoneScreen() {
  const scene = useGameStore((s) => s.scene)
  const goTo = useGameStore((s) => s.goTo)
  const learn = learnFor(useGameStore((s) => s.lang))
  const zone = zoneById[scene]
  const game = learn === 'th' ? ZONE_GAMES[zone.id] : null
  const modes = game ? [...MODES, game] : MODES
  const [mode, setMode] = useState(modes[modes.length - 1].id)
  const [stage, setStage] = useState(() => startStage(mode, zone.vocab))
  const word = mode === 'pay' ? null : zone.vocab.find((w) => w.id === stage.wordId)

  // Word modes only nudge the person; let them settle back afterwards.
  useEffect(() => {
    if (mode === 'pay' || stage.mood === 'idle') return undefined
    const timer = setTimeout(() => setStage((s) => ({ ...s, mood: 'idle' })), MOOD_MS)
    return () => clearTimeout(timer)
  }, [mode, stage])

  const pickMode = (id) => {
    setMode(id)
    setStage(startStage(id, zone.vocab))
  }

  return (
    <div className="screen screen-zone">
      <Hud
        onBack={() => goTo('hub')}
        title={
          <>
            {zone.icon} <Label text={zone} />
          </>
        }
      />
      <div className="zone-stage">
        <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 40, position: [0.4, 2.4, 5] }}>
          <ZoneScene zoneId={zone.id} stage={stage} />
          <LookAt target={[0.4, 1.2, 0.4]} />
        </Canvas>
        {word && (
          <div key={word.id} className="zone-picture" aria-hidden="true">
            <Picture text={word.icon} />
          </div>
        )}
      </div>
      <nav className="tabs">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`tab ${mode === m.id ? 'is-active' : ''}`}
            onClick={() => pickMode(m.id)}
          >
            <span className="tab-icon">{m.icon}</span>
            <Label k={m.label} />
          </button>
        ))}
      </nav>
      <main className="zone-content">
        {mode === 'cards' && <FlashcardMode words={zone.vocab} onStage={setStage} />}
        {mode === 'speak' && <SpeakMode words={zone.vocab} onStage={setStage} />}
        {mode === 'pay' && <PayGame onStage={setStage} />}
      </main>
    </div>
  )
}
