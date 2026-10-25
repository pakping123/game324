import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { Vector3 } from 'three'
import { MAP_RADIUS, ZONES } from '../../data/zones.js'
import { BusStop, Factory, MarketStall, NoodleShop, Pharmacy, SignPosts } from './Buildings.jsx'
import { Clouds, Lighting, Tree } from './Scenery.jsx'

const BUILDINGS = {
  market: MarketStall,
  travel: BusStop,
  directions: SignPosts,
  food: NoodleShop,
  pharmacy: Pharmacy,
  work: Factory,
}

// Deterministic tree layout around the edge of the map.
function makeTrees() {
  let seed = 11
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: 34 }, (_, i) => {
    const angle = (i / 34) * Math.PI * 2 + rand() * 0.15
    const r = MAP_RADIUS + 1.5 + rand() * 4
    return {
      position: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
      scale: 0.8 + rand() * 0.6,
      kind: rand() > 0.6 ? 'palm' : 'round',
    }
  })
}
const TREES = makeTrees()

const LABEL_HEIGHT = 3.4
const LABEL_BOB = 0.15

function ZoneBuilding({ zone, onSelect }) {
  const Building = BUILDINGS[zone.id]
  const [x, , z] = zone.position
  // Turn the door side (+z) to face the plaza in the middle of the map.
  const rotationY = Math.atan2(-x, -z)
  return (
    <group
      position={zone.position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(zone)
      }}
    >
      <Building />
    </group>
  )
}

// Moves the zone labels (plain DOM elements outside the canvas, see
// ZoneLabels) to sit above their buildings, gently bobbing. drei's <Html>
// would do this, but its React roots get lost under StrictMode.
function LabelTracker({ labelRefs }) {
  const v = useMemo(() => new Vector3(), [])
  useFrame(({ camera, size, clock }) => {
    ZONES.forEach((zone, i) => {
      const el = labelRefs.current[zone.id]
      if (!el) return
      const bob = Math.sin(clock.elapsedTime * 2 + i) * LABEL_BOB
      v.set(zone.position[0], LABEL_HEIGHT + bob, zone.position[2]).project(camera)
      const visible = v.z < 1
      el.style.visibility = visible ? 'visible' : 'hidden'
      el.style.transform = `translate(-50%, -100%) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`
    })
  })
  return null
}

// The town map: grass, roads to every zone, the zone buildings and trees.
// Pass `labelRefs` (filled by ZoneLabels) to float zone names over buildings.
export default function Town({ onGround, onZone, labelRefs, children }) {
  return (
    <>
      <Lighting />
      <Clouds />
      {/* grass */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          onGround?.(e.point)
        }}
      >
        <circleGeometry args={[MAP_RADIUS + 8, 48]} />
        <meshStandardMaterial color="#86d97a" />
      </mesh>
      {/* plaza and roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[3.2, 32]} />
        <meshStandardMaterial color="#e7d8b5" />
      </mesh>
      {ZONES.map((zone) => {
        const [x, , z] = zone.position
        const len = Math.hypot(x, z)
        return (
          <mesh
            key={zone.id}
            rotation={[-Math.PI / 2, 0, -Math.atan2(z, x)]}
            position={[x / 2, 0.015, z / 2]}
            receiveShadow
          >
            <planeGeometry args={[len, 1.6]} />
            <meshStandardMaterial color="#d6c49b" />
          </mesh>
        )
      })}
      {/* fountain in the plaza */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.5, 16]} />
        <meshStandardMaterial color="#cbd5e1" flatShading />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.05, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0c4a6e" emissiveIntensity={0.3} />
      </mesh>

      {ZONES.map((zone) => (
        <ZoneBuilding key={zone.id} zone={zone} onSelect={onZone} />
      ))}
      {TREES.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
      {labelRefs && <LabelTracker labelRefs={labelRefs} />}
      {children}
    </>
  )
}
