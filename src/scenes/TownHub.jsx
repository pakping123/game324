import { Canvas } from '@react-three/fiber'
import { useRef, useState } from 'react'
import Player from '../components/three/Player.jsx'
import Town from '../components/three/Town.jsx'
import TownDecor from '../components/three/TownDecor.jsx'
import Hud from '../components/ui/Hud.jsx'
import Label from '../components/ui/Label.jsx'
import SpotCard from '../components/ui/SpotCard.jsx'
import ZoneLabels from '../components/ui/ZoneLabels.jsx'
import { nearestSpot, TOWN_SPOTS } from '../data/townSpots.js'
import { MAP_RADIUS, zoneDoor } from '../data/zones.js'
import { learnFor } from '../lib/line.js'
import { scoreKey } from '../lib/road.js'
import { speakLine } from '../lib/speakEntry.js'
import { isPass } from '../speech/evaluateAttempt.js'
import { useGameStore } from '../store/useGameStore.js'

const TOAST_MS = 2200
// Stop this far in front of a spot when walking to it.
const SPOT_STOP = 1.4

// The town map. Tap the ground to walk; tap a building to walk to its door
// and go in. Walking up to a tree, a bench or another thing around the town
// shows its word to practise.
export default function TownHub() {
  const hubPos = useGameStore((s) => s.hubPos)
  const enterZone = useGameStore((s) => s.enterZone)
  const goTo = useGameStore((s) => s.goTo)
  const learn = learnFor(useGameStore((s) => s.lang))
  const wordScores = useGameStore((s) => s.wordScores)
  const [target, setTarget] = useState(hubPos)
  const [heading, setHeading] = useState(null)
  const [lockedZone, setLockedZone] = useState(null)
  const [spot, setSpot] = useState(null)
  // The spot the player is standing at, also while its card is closed, so
  // the card only opens again after walking away and back.
  const nearId = useRef(null)
  const labelRefs = useRef({})

  const passed = new Set(
    TOWN_SPOTS.filter((s) => isPass(wordScores[scoreKey(learn, s.entry.id)])).map((s) => s.id),
  )

  const walkTo = (point) => {
    const r = Math.hypot(point.x, point.z)
    const k = r > MAP_RADIUS ? MAP_RADIUS / r : 1
    setTarget([point.x * k, point.z * k])
    setHeading(null)
  }

  const goToZone = (zone) => {
    setTarget(zoneDoor(zone))
    setHeading(zone)
  }

  // Walk up to a spot, stopping on the side nearer the plaza.
  const goToSpot = (s) => {
    const [x, z] = s.position
    const len = Math.hypot(x, z) || 1
    setTarget([x - (x / len) * SPOT_STOP, z - (z / len) * SPOT_STOP])
    setHeading(null)
  }

  const moved = (x, z) => {
    const near = nearestSpot(x, z)
    if ((near?.id ?? null) === nearId.current) return
    nearId.current = near?.id ?? null
    setSpot(near)
    if (near) {
      const { gender, settings } = useGameStore.getState()
      speakLine(near.entry, learn, gender, settings)
    }
  }

  const arrive = () => {
    if (!heading) return
    if (heading.ready) {
      enterZone(heading.id, target)
      return
    }
    setLockedZone(heading)
    setHeading(null)
    setTimeout(() => setLockedZone(null), TOAST_MS)
  }

  return (
    <div className="screen screen-hub">
      <Canvas className="scene-bg" shadows dpr={[1, 1.75]} camera={{ fov: 45, position: [0, 13, 14] }}>
        <Town onGround={walkTo} onZone={goToZone} labelRefs={labelRefs}>
          <TownDecor passed={passed} onSelect={goToSpot} />
          <Player start={hubPos} target={target} onArrive={arrive} onMove={moved} />
        </Town>
      </Canvas>
      <ZoneLabels labelRefs={labelRefs} onSelect={goToZone} />
      <Hud onBack={() => goTo('road')} backIcon="🚶" backLabel="toRoad" />
      {spot ? (
        <div className="road-sheet">
          <SpotCard key={spot.id} spot={spot} onClose={() => setSpot(null)} />
        </div>
      ) : lockedZone ? (
        <p className="toast toast-bad">
          🔒 <Label text={lockedZone} /> · <Label k="comingSoon" />
        </p>
      ) : (
        <p className="hub-hint">
          <Label k="tapToWalk" />
        </p>
      )}
    </div>
  )
}
