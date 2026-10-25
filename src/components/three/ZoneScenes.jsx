import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { DoubleSide } from 'three'
import { ZONE_LOOKS } from '../../data/looks.js'
import { Box, Factory, Pharmacy, SignPosts, StripedAwning } from './Buildings.jsx'
import Character from './Character.jsx'
import MarketScene from './MarketScene.jsx'
import { Lighting, Tree } from './Scenery.jsx'

// A close-up 3D scene for each zone of the town, seen by the fixed camera in
// ZoneScreen (from [0.4, 2.4, 5] towards [0.4, 1.2, 0.4]). Each has the
// zone's building, things that fit its words, and the person the player
// talks with, standing at the right. Everything is built from primitives.
// `stage`: { wordId, mood: 'idle' | 'talking' | 'happy' | 'confused' }

const NPC_MOTION = { idle: 'idle', talking: 'talk', happy: 'happy', confused: 'confused' }
// Vehicles drive between -ROAD_END and ROAD_END, then come round again.
const ROAD_END = 18

function Ground({ color = '#86d97a' }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[40, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// A flat strip on the ground (pavement, road, floor).
function Flat({ size, color, position, rotation = 0 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, rotation]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Person({ look, stage, position = [2.05, 0, 0.9], rotation = [0, -0.35, 0] }) {
  return <Character {...look} position={position} rotation={rotation} motion={NPC_MOTION[stage?.mood] ?? 'idle'} />
}

function Wheel({ position, r = 0.3, width = 0.2 }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[r, r, width, 12]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
  )
}

// Moves its children along x at `speed` (units per second), round and round.
function Drive({ z, speed, start = 0, children }) {
  const ref = useRef()
  useFrame((_, delta) => {
    const g = ref.current
    g.position.x += speed * delta
    if (g.position.x > ROAD_END) g.position.x = -ROAD_END
    if (g.position.x < -ROAD_END) g.position.x = ROAD_END
  })
  return (
    <group ref={ref} position={[start, 0, z]} rotation={[0, speed < 0 ? Math.PI : 0, 0]}>
      {children}
    </group>
  )
}

// A city bus facing +x.
function Bus({ color = '#f97316' }) {
  return (
    <group>
      <Box size={[3.6, 1.3, 1.4]} color={color} position={[0, 0.95, 0]} />
      <Box size={[3.2, 0.45, 1.42]} color="#e0f2fe" position={[-0.1, 1.3, 0]} />
      <Box size={[0.05, 0.6, 1.2]} color="#e0f2fe" position={[1.8, 1.2, 0]} />
      {[-1.15, 1.15].map((x) => [-0.7, 0.7].map((z) => <Wheel key={`${x}${z}`} position={[x, 0.3, z]} />))}
    </group>
  )
}

// A pink Bangkok taxi facing +x.
function Taxi() {
  return (
    <group>
      <Box size={[2, 0.55, 1]} color="#ec4899" position={[0, 0.5, 0]} />
      <Box size={[1.1, 0.45, 0.92]} color="#f9a8d4" position={[-0.1, 0.98, 0]} />
      <Box size={[0.45, 0.14, 0.24]} color="#facc15" position={[-0.1, 1.28, 0]} />
      {[-0.65, 0.65].map((x) => [-0.5, 0.5].map((z) => <Wheel key={`${x}${z}`} position={[x, 0.22, z]} r={0.22} width={0.14} />))}
    </group>
  )
}

function Suitcase({ position }) {
  return (
    <group position={position} rotation={[0, -0.4, 0]}>
      <Box size={[0.4, 0.55, 0.22]} color="#7c3aed" position={[0, 0.3, 0]} />
      <Box size={[0.04, 0.3, 0.04]} color="#334155" position={[0, 0.72, 0]} />
      <Box size={[0.2, 0.04, 0.04]} color="#334155" position={[0, 0.86, 0]} />
    </group>
  )
}

// 🚌 A bus stop by a busy road: a shelter with a bench, the stop sign, a
// traveller with a suitcase, and buses and taxis going by behind.
function TravelScene({ stage }) {
  return (
    <>
      <Ground />
      <Flat size={[40, 3]} color="#d6d3d1" position={[0, 0.01, 0.6]} />
      <Flat size={[40, 3.6]} color="#475569" position={[0, 0.01, -3.1]} />
      {Array.from({ length: 14 }, (_, i) => (
        <Flat key={i} size={[1.2, 0.12]} color="#f8fafc" position={[-19 + i * 3, 0.02, -3.1]} />
      ))}
      <group position={[-0.7, 0, -0.5]}>
        <Box size={[3.2, 0.12, 1.5]} color="#0284c7" position={[0, 2.25, 0]} />
        {[-1.5, 1.5].map((x) => (
          <Box key={x} size={[0.1, 2.25, 0.1]} color="#94a3b8" position={[x, 1.12, -0.6]} />
        ))}
        <mesh position={[0, 1.25, -0.66]}>
          <boxGeometry args={[2.9, 1.6, 0.05]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.55} />
        </mesh>
        {/* route map on the back wall */}
        <Box size={[0.9, 0.6, 0.03]} color="#fef9c3" position={[-0.8, 1.5, -0.62]} />
        <Box size={[0.7, 0.04, 0.035]} color="#ef4444" position={[-0.8, 1.55, -0.6]} />
        <Box size={[0.7, 0.04, 0.035]} color="#22c55e" position={[-0.8, 1.42, -0.6]} />
        <Box size={[2.3, 0.1, 0.45]} color="#64748b" position={[0.2, 0.5, -0.3]} />
        {[-0.8, 1.2].map((x) => (
          <Box key={x} size={[0.08, 0.5, 0.35]} color="#475569" position={[x, 0.25, -0.3]} />
        ))}
      </group>
      {/* the bus stop sign */}
      <group position={[1.05, 0, 0.35]}>
        <Box size={[0.08, 2.6, 0.08]} color="#94a3b8" position={[0, 1.3, 0]} />
        <mesh position={[0, 2.55, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.05, 20]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <Box size={[0.36, 0.2, 0.02]} color="#f8fafc" position={[0, 2.55, 0.09]} />
      </group>
      <Suitcase position={[2.7, 0, 1.15]} />
      <Person look={ZONE_LOOKS.travel} stage={stage} />
      <Drive z={-3.9} speed={2.6} start={-6}>
        <Bus />
      </Drive>
      <Drive z={-2.3} speed={-3.6} start={9}>
        <Taxi />
      </Drive>
      <Drive z={-2.3} speed={-3.6} start={-5}>
        <Bus color="#16a34a" />
      </Drive>
      <Tree position={[-5.5, 0, -6.5]} scale={1.3} />
      <Tree position={[4.5, 0, -6.8]} kind="palm" scale={1.4} />
      <Tree position={[-3.8, 0, 1.4]} scale={0.9} />
      <Tree position={[5.2, 0, 0.6]} kind="palm" />
    </>
  )
}

// Three lamps changing red, green, yellow in turn.
function TrafficLight({ position }) {
  const lamps = useRef()
  const COLORS = ['#ef4444', '#facc15', '#22c55e']
  // Seconds each lamp stays on: red, then green, then yellow.
  const ORDER = [0, 2, 1]
  const TIMES = [3, 3, 1]
  const cycle = TIMES.reduce((a, b) => a + b, 0)
  useFrame(({ clock }) => {
    let t = clock.elapsedTime % cycle
    let on = ORDER[0]
    for (let i = 0; i < ORDER.length; i++) {
      if (t < TIMES[i]) {
        on = ORDER[i]
        break
      }
      t -= TIMES[i]
    }
    lamps.current.children.forEach((lamp, i) => {
      lamp.material.emissiveIntensity = i === on ? 1.4 : 0.05
    })
  })
  return (
    <group position={position}>
      <Box size={[0.1, 2.2, 0.1]} color="#334155" position={[0, 1.1, 0]} />
      <Box size={[0.36, 0.95, 0.3]} color="#1f2937" position={[0, 2.5, 0]} />
      <group ref={lamps}>
        {COLORS.map((c, i) => (
          <mesh key={c} position={[0, 2.8 - i * 0.3, 0.16]}>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.05} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// 🧭 A crossroads in a soi: a signpost pointing three ways, small houses, a
// traffic light, a road behind and a local who knows the way.
function DirectionsScene({ stage }) {
  return (
    <>
      <Ground />
      <Flat size={[40, 2.4]} color="#475569" position={[0, 0.01, -3]} />
      <Flat size={[2, 6]} color="#d6c7a1" position={[-0.4, 0.015, 1]} />
      {Array.from({ length: 12 }, (_, i) => (
        <Flat key={i} size={[1, 0.1]} color="#fde047" position={[-17 + i * 3, 0.02, -3]} />
      ))}
      {/* zebra crossing to the path */}
      {Array.from({ length: 5 }, (_, i) => (
        <Flat key={i} size={[0.25, 2.2]} color="#f8fafc" position={[-1 + i * 0.4, 0.025, -3]} />
      ))}
      <group position={[-0.4, 0, -0.2]}>
        <SignPosts />
      </group>
      <TrafficLight position={[0.7, 0, -2.1]} />
      {/* a map board */}
      <group position={[-3.4, 0, 0.8]} rotation={[0, 0.5, 0]}>
        {[-0.5, 0.5].map((x) => (
          <Box key={x} size={[0.08, 1.2, 0.08]} color="#78350f" position={[x, 0.6, 0]} />
        ))}
        <Box size={[1.3, 0.9, 0.06]} color="#fef3c7" position={[0, 1.5, 0]} />
        <Box size={[1, 0.06, 0.07]} color="#3b82f6" position={[0, 1.6, 0.01]} />
        <Box size={[0.06, 0.6, 0.07]} color="#3b82f6" position={[0.15, 1.5, 0.01]} />
        <mesh position={[-0.3, 1.35, 0.05]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
      <Person look={ZONE_LOOKS.directions} stage={stage} />
      <Drive z={-3.5} speed={2.2} start={-8}>
        <Taxi />
      </Drive>
      <Tree position={[-5, 0, -1]} scale={1.2} />
      <Tree position={[4.2, 0, -0.6]} kind="palm" scale={1.2} />
      <Tree position={[-6, 0, -6]} kind="palm" scale={1.4} />
      <Tree position={[6, 0, -6]} scale={1.3} />
    </>
  )
}

// White puffs rising from a pot.
function Steam({ position }) {
  const puffs = useRef()
  useFrame(({ clock }) => {
    puffs.current.children.forEach((m, i) => {
      const t = (clock.elapsedTime * 0.5 + i / 3) % 1
      m.position.set(Math.sin(t * 6 + i) * 0.06, t * 0.8, 0)
      m.scale.setScalar(0.6 + t)
      m.material.opacity = 0.7 * (1 - t)
    })
  })
  return (
    <group ref={puffs} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Bowl({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f8fafc" side={DoubleSide} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <Box size={[0.02, 0.02, 0.32]} color="#92400e" position={[0.06, 0.03, 0]} />
    </group>
  )
}

// 🍜 A noodle shop: the shop under its striped awning, a noodle cart with a
// steaming pot, a table with bowls and red stools, and the cook.
function FoodScene({ stage }) {
  return (
    <>
      <Ground />
      <Flat size={[9, 4.5]} color="#e7d8b5" position={[0, 0.01, 0.3]} />
      <group position={[0, 0, -1.6]}>
        <Box size={[4.4, 2.6, 1.6]} color="#fef3c7" position={[0, 1.3, 0]} />
        <Box size={[4.6, 0.3, 1.8]} color="#b91c1c" position={[0, 2.75, 0]} />
        <Box size={[2.2, 0.5, 0.08]} color="#dc2626" position={[0, 3.15, 0.5]} />
        <Box size={[1.6, 0.12, 0.09]} color="#fde047" position={[0, 3.15, 0.52]} />
        <Box size={[1, 1.6, 0.05]} color="#7c2d12" position={[-1.2, 0.8, 0.82]} />
        <Box size={[1.4, 0.9, 0.05]} color="#bae6fd" position={[0.9, 1.3, 0.82]} />
        <group position={[0, 0, 0.8]}>
          <StripedAwning width={4.4} depth={1.1} y={2.2} colors={['#dc2626', '#fde047']} />
        </group>
        {[-1.9, -0.7, 0.5].map((x) => (
          <mesh key={x} position={[x, 1.9, 1.75]} castShadow>
            <sphereGeometry args={[0.17, 10, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" />
          </mesh>
        ))}
      </group>
      {/* the noodle cart */}
      <group position={[0.9, 0, 0.55]}>
        <Box size={[1.7, 0.85, 0.7]} color="#cbd5e1" position={[0, 0.5, 0]} />
        <mesh position={[-0.2, 1.17, 0]}>
          <boxGeometry args={[1.1, 0.5, 0.6]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.5} />
        </mesh>
        {/* noodles and greens behind the glass */}
        <Box size={[0.3, 0.1, 0.3]} color="#fde68a" position={[-0.45, 1.0, 0]} />
        <Box size={[0.3, 0.1, 0.3]} color="#4ade80" position={[0.05, 1.0, 0]} />
        <mesh position={[0.55, 1.08, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.32, 14]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.4} />
        </mesh>
        <Steam position={[0.55, 1.3, 0]} />
        {[-0.7, 0.7].map((x) => (
          <Wheel key={x} position={[x, 0.18, 0.38]} r={0.18} width={0.06} />
        ))}
      </group>
      {/* a table with two bowls and three stools */}
      <group position={[-1.9, 0, 1.0]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 16]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <Box size={[0.08, 0.7, 0.08]} color="#9ca3af" position={[0, 0.35, 0]} />
        <Bowl position={[-0.2, 0.84, 0.1]} />
        <Bowl position={[0.22, 0.84, -0.1]} />
        {[0.4, 2.5, 4.4].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.85, 0.22, Math.sin(a) * 0.85]} castShadow>
            <cylinderGeometry args={[0.18, 0.15, 0.44, 10]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        ))}
      </group>
      <Person look={ZONE_LOOKS.food} stage={stage} position={[2.15, 0, 0.45]} />
      <Tree position={[-4.8, 0, -1.5]} kind="palm" scale={1.3} />
      <Tree position={[4.8, 0, -1.8]} scale={1.2} />
      <Tree position={[-6.5, 0, -6]} scale={1.3} />
    </>
  )
}

// A medicine box on a shelf.
const MEDICINE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#14b8a6', '#f472b6']

function MedicineShelf({ position }) {
  return (
    <group position={position}>
      <Box size={[1.5, 1.9, 0.45]} color="#e2e8f0" position={[0, 0.95, 0]} />
      {[0.45, 0.95, 1.45].map((y, row) =>
        [0, 1, 2, 3, 4].map((i) => (
          <Box
            key={`${row}-${i}`}
            size={[0.2, 0.28, 0.2]}
            color={MEDICINE_COLORS[(row * 5 + i) % MEDICINE_COLORS.length]}
            position={[-0.56 + i * 0.28, y + 0.14, 0.15]}
          />
        )),
      )}
    </group>
  )
}

// A two-colored pill, floating.
function Capsule({ position }) {
  return (
    <Float speed={2.5} floatIntensity={0.6} rotationIntensity={1}>
      <group position={position} rotation={[0, 0, 0.9]}>
        <mesh position={[0, 0.13, 0]}>
          <capsuleGeometry args={[0.13, 0.26, 6, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <capsuleGeometry args={[0.131, 0.26, 6, 12]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
    </Float>
  )
}

// 💊 A pharmacy: the shop with its green cross, shelves of medicine, a
// counter with bottles and the pharmacist in her white coat behind it.
function PharmacyScene({ stage }) {
  return (
    <>
      <Ground />
      <Flat size={[9, 4.5]} color="#e2e8f0" position={[0, 0.01, 0.3]} />
      <group position={[0, 0, -1.1]}>
        <Pharmacy />
      </group>
      <MedicineShelf position={[-1.9, 0, -0.1]} />
      <Capsule position={[-1.9, 2.4, 0]} />
      {/* the counter */}
      <group position={[1.55, 0, 1.25]}>
        <Box size={[1.7, 0.95, 0.55]} color="#f8fafc" position={[0, 0.48, 0]} />
        <Box size={[1.72, 0.12, 0.57]} color="#0d9488" position={[0, 0.7, 0]} />
        {MEDICINE_COLORS.slice(0, 4).map((c, i) => (
          <mesh key={c} position={[-0.6 + i * 0.22, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.2, 10]} />
            <meshStandardMaterial color={c} />
          </mesh>
        ))}
        <Box size={[0.3, 0.06, 0.2]} color="#fef9c3" position={[0.45, 0.98, 0.05]} />
      </group>
      <Person look={ZONE_LOOKS.pharmacy} stage={stage} position={[2.05, 0, 0.55]} />
      {/* potted plants by the door */}
      {[-0.95, 0.95].map((x) => (
        <group key={x} position={[x, 0, 0.05]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.14, 0.4, 10]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#16a34a" flatShading />
          </mesh>
        </group>
      ))}
      <Tree position={[-4.8, 0, -1.2]} scale={1.2} />
      <Tree position={[4.6, 0, -1.5]} kind="palm" scale={1.3} />
      <Tree position={[6.5, 0, -6]} scale={1.3} />
    </>
  )
}

// A wall clock whose hands go round fast: work time passing.
function WallClock({ position }) {
  const minute = useRef()
  const hour = useRef()
  useFrame(({ clock }) => {
    minute.current.rotation.z = -clock.elapsedTime * 1.2
    hour.current.rotation.z = -clock.elapsedTime * 0.1
  })
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <group ref={minute} position={[0, 0, 0.04]}>
        <Box size={[0.03, 0.26, 0.02]} color="#111827" position={[0, 0.12, 0]} />
      </group>
      <group ref={hour} position={[0, 0, 0.05]}>
        <Box size={[0.045, 0.16, 0.02]} color="#111827" position={[0, 0.07, 0]} />
      </group>
    </group>
  )
}

// Boxes riding a conveyor belt from left to right.
function Conveyor({ position }) {
  const LENGTH = 3
  const boxes = useRef()
  useFrame(({ clock }) => {
    boxes.current.children.forEach((b, i) => {
      b.position.x = ((clock.elapsedTime * 0.5 + i * (LENGTH / 4)) % LENGTH) - LENGTH / 2
    })
  })
  return (
    <group position={position}>
      <Box size={[LENGTH + 0.3, 0.14, 0.7]} color="#334155" position={[0, 0.75, 0]} />
      {[-LENGTH / 2, 0, LENGTH / 2].map((x) => (
        <Box key={x} size={[0.1, 0.7, 0.6]} color="#64748b" position={[x, 0.35, 0]} />
      ))}
      <group ref={boxes}>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} size={[0.38, 0.32, 0.38]} color="#d97706" position={[0, 0.98, 0]} />
        ))}
      </group>
    </group>
  )
}

function Cone({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.17, 0.55, 12]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.095, 0.115, 0.08, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <Box size={[0.4, 0.04, 0.4]} color="#f97316" position={[0, 0.02, 0]} />
    </group>
  )
}

// 🏭 A factory yard: the factory with its chimney and a wall clock, boxes on
// a conveyor belt, a stack on a pallet, safety cones and the supervisor.
function WorkScene({ stage }) {
  return (
    <>
      <Ground />
      <Flat size={[11, 5]} color="#cbd5e1" position={[0, 0.01, 0.2]} />
      {/* yellow safety lines */}
      <Flat size={[9, 0.08]} color="#facc15" position={[0, 0.02, 1.7]} />
      <Flat size={[9, 0.08]} color="#facc15" position={[0, 0.02, -0.6]} />
      <group position={[0, 0, -2.1]}>
        <Factory />
      </group>
      <WallClock position={[1.3, 1.75, -1.44]} />
      <Conveyor position={[-0.7, 0, 0.4]} />
      {/* boxes stacked on a pallet */}
      <group position={[-3.1, 0, 0.5]}>
        <Box size={[1.1, 0.12, 0.9]} color="#a16207" position={[0, 0.06, 0]} />
        {[
          [-0.25, 0.32, -0.2],
          [0.25, 0.32, -0.2],
          [-0.25, 0.32, 0.22],
          [0.25, 0.32, 0.22],
          [0, 0.72, 0],
        ].map((p) => (
          <Box key={p.join()} size={[0.46, 0.4, 0.4]} color="#d97706" position={p} />
        ))}
      </group>
      <Cone position={[0.9, 0, 1.75]} />
      <Cone position={[-2.3, 0, 1.8]} />
      {/* work gloves on top of the stack */}
      <Box size={[0.2, 0.06, 0.28]} color="#facc15" position={[-3.1, 0.96, 0.5]} />
      <Person look={ZONE_LOOKS.work} stage={stage} />
      <Tree position={[-5.5, 0, -2]} scale={1.2} />
      <Tree position={[5.4, 0, -2.4]} kind="palm" scale={1.3} />
    </>
  )
}

const SCENES = {
  market: MarketScene,
  travel: TravelScene,
  directions: DirectionsScene,
  food: FoodScene,
  pharmacy: PharmacyScene,
  work: WorkScene,
}

// The 3D scene for zone `zoneId` (see the top of this file).
export default function ZoneScene({ zoneId, stage }) {
  const Scene = SCENES[zoneId] ?? MarketScene
  return (
    <>
      <Lighting />
      <Scene stage={stage} />
    </>
  )
}
