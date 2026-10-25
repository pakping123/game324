import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { TOWN_SPOTS } from '../../data/townSpots.js'
import { Tree } from './Scenery.jsx'

// The things around the town that have a word to practise (data/townSpots.js),
// each with a soft ring on the ground so players notice them, and a green gem
// above once its word has been said well. Tapping one walks there.

function Box({ size, color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

function Cyl({ args, color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

function Ball({ r, color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <sphereGeometry args={[r, 12, 10]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

function Wheel({ position, r = 0.22, color = '#111827' }) {
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]} castShadow>
      <torusGeometry args={[r, 0.05, 8, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const FLOWER_COLORS = ['#f472b6', '#facc15', '#f87171', '#a78bfa', '#fb923c']

const MODELS = {
  tree: () => <Tree position={[0, 0, 0]} scale={1.1} />,
  coconut: () => <Tree position={[0, 0, 0]} kind="palm" scale={1.2} />,
  bananaTree: () => (
    <group>
      <Cyl args={[0.12, 0.16, 1.4, 8]} color="#65a30d" position={[0, 0.7, 0]} />
      {[0, 1.3, 2.6, 3.9, 5.2].map((a) => (
        <Box key={a} size={[0.32, 0.04, 1.1]} color="#22c55e" position={[Math.sin(a) * 0.4, 1.45, Math.cos(a) * 0.4]} rotation={[0.5, a, 0]} />
      ))}
      <Ball r={0.13} color="#facc15" position={[0.15, 1.05, 0.15]} />
    </group>
  ),
  flowers: () => (
    <group>
      <Box size={[1.4, 0.25, 0.8]} color="#92400e" position={[0, 0.12, 0]} />
      {FLOWER_COLORS.flatMap((c, i) => [
        <Ball key={`${c}a`} r={0.1} color={c} position={[-0.55 + i * 0.27, 0.36, -0.18]} />,
        <Ball key={`${c}b`} r={0.1} color={FLOWER_COLORS[(i + 2) % 5]} position={[-0.5 + i * 0.27, 0.36, 0.18]} />,
      ])}
    </group>
  ),
  bench: () => (
    <group>
      <Box size={[1.4, 0.08, 0.45]} color="#b45309" position={[0, 0.45, 0]} />
      <Box size={[1.4, 0.35, 0.06]} color="#b45309" position={[0, 0.7, -0.2]} />
      {[-0.6, 0.6].map((x) => (
        <Box key={x} size={[0.08, 0.45, 0.4]} color="#44403c" position={[x, 0.22, 0]} />
      ))}
    </group>
  ),
  lamp: () => (
    <group>
      <Cyl args={[0.06, 0.09, 2.6, 8]} color="#475569" position={[0, 1.3, 0]} />
      <Box size={[0.5, 0.06, 0.06]} color="#475569" position={[0.22, 2.55, 0]} />
      <mesh position={[0.42, 2.45, 0]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={0.6} />
      </mesh>
    </group>
  ),
  mailbox: () => (
    <group>
      <Cyl args={[0.05, 0.05, 0.6, 6]} color="#475569" position={[0, 0.3, 0]} />
      <Box size={[0.5, 0.6, 0.4]} color="#dc2626" position={[0, 0.9, 0]} />
      <Cyl args={[0.25, 0.25, 0.4, 12, 1, false, 0, Math.PI]} color="#dc2626" position={[0, 1.2, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <Box size={[0.3, 0.05, 0.02]} color="#111827" position={[0, 1.0, 0.21]} />
    </group>
  ),
  shrine: () => (
    <group>
      <Cyl args={[0.08, 0.1, 1.2, 8]} color="#e5e7eb" position={[0, 0.6, 0]} />
      <Box size={[0.8, 0.08, 0.7]} color="#f5f5f4" position={[0, 1.22, 0]} />
      <Box size={[0.55, 0.45, 0.45]} color="#fbbf24" position={[0, 1.48, 0]} />
      <mesh position={[0, 1.88, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.5, 0.4, 4]} />
        <meshStandardMaterial color="#b91c1c" flatShading />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <Ball key={x} r={0.06} color="#f472b6" position={[x, 1.3, 0.32]} />
      ))}
    </group>
  ),
  foodCart: () => (
    <group>
      <Box size={[1.2, 0.6, 0.6]} color="#f8fafc" position={[0, 0.6, 0]} />
      <Box size={[1.2, 0.08, 0.6]} color="#ef4444" position={[0, 0.94, 0]} />
      <Wheel position={[-0.45, 0.25, 0.32]} r={0.2} />
      <Wheel position={[0.45, 0.25, 0.32]} r={0.2} />
      <Cyl args={[0.03, 0.03, 1.2, 6]} color="#64748b" position={[0, 1.5, 0]} />
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[0.85, 0.35, 10]} />
        <meshStandardMaterial color="#f97316" flatShading />
      </mesh>
      {[-0.3, 0, 0.3].map((x) => (
        <Cyl key={x} args={[0.02, 0.02, 0.35, 4]} color="#a16207" position={[x, 1.1, 0]} rotation={[0, 0, 0.3]} />
      ))}
    </group>
  ),
  bicycle: () => (
    <group>
      <Wheel position={[0, 0.32, -0.45]} r={0.3} />
      <Wheel position={[0, 0.32, 0.45]} r={0.3} />
      <Cyl args={[0.025, 0.025, 0.9, 6]} color="#0ea5e9" position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Cyl args={[0.025, 0.025, 0.5, 6]} color="#0ea5e9" position={[0, 0.6, -0.25]} rotation={[0.4, 0, 0]} />
      <Box size={[0.12, 0.05, 0.25]} color="#111827" position={[0, 0.85, -0.3]} />
      <Box size={[0.5, 0.04, 0.04]} color="#111827" position={[0, 0.85, 0.4]} />
    </group>
  ),
  motorbike: () => (
    <group>
      <Wheel position={[0, 0.3, -0.55]} r={0.28} />
      <Wheel position={[0, 0.3, 0.55]} r={0.28} />
      <Box size={[0.32, 0.3, 0.9]} color="#dc2626" position={[0, 0.6, -0.05]} />
      <Box size={[0.3, 0.12, 0.5]} color="#111827" position={[0, 0.8, -0.2]} />
      <Box size={[0.6, 0.05, 0.05]} color="#9ca3af" position={[0, 1.0, 0.45]} />
    </group>
  ),
  bird: () => (
    <group>
      <Cyl args={[0.04, 0.04, 1.2, 6]} color="#78350f" position={[0, 0.6, 0]} />
      <Ball r={0.2} color="#38bdf8" position={[0, 1.35, 0]} />
      <Ball r={0.13} color="#38bdf8" position={[0, 1.55, 0.14]} />
      <mesh position={[0, 1.55, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  ),
  car: () => (
    <group>
      <Box size={[1, 0.45, 1.9]} color="#2563eb" position={[0, 0.45, 0]} />
      <Box size={[0.9, 0.4, 1]} color="#bfdbfe" position={[0, 0.85, -0.1]} />
      {[-0.55, 0.55].flatMap((x) =>
        [-0.6, 0.6].map((z) => <Wheel key={`${x}${z}`} position={[x, 0.22, z]} />),
      )}
    </group>
  ),
  trashBin: () => (
    <group>
      <Cyl args={[0.28, 0.24, 0.8, 12]} color="#16a34a" position={[0, 0.4, 0]} />
      <Cyl args={[0.31, 0.31, 0.08, 12]} color="#15803d" position={[0, 0.84, 0]} />
    </group>
  ),
  ball: () => <Ball r={0.3} color="#f8fafc" position={[0, 0.3, 0]} />,
  sala: () => (
    <group>
      <Box size={[1.8, 0.15, 1.6]} color="#d6d3d1" position={[0, 0.08, 0]} />
      {[-0.75, 0.75].flatMap((x) =>
        [-0.65, 0.65].map((z) => <Cyl key={`${x}${z}`} args={[0.06, 0.06, 1.6, 6]} color="#7c2d12" position={[x, 0.9, z]} />),
      )}
      <mesh position={[0, 2.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.45, 0.75, 4]} />
        <meshStandardMaterial color="#b91c1c" flatShading />
      </mesh>
    </group>
  ),
  elephant: () => (
    <group>
      <Box size={[0.7, 0.2, 1.2]} color="#a8a29e" position={[0, 0.1, 0]} />
      <Ball r={0.42} color="#9ca3af" position={[0, 0.75, -0.05]} scale={[1, 0.9, 1.3]} />
      <Ball r={0.27} color="#9ca3af" position={[0, 1.05, 0.48]} />
      {[-1, 1].map((s) => (
        <Box key={s} size={[0.04, 0.32, 0.28]} color="#9ca3af" position={[s * 0.27, 1.05, 0.42]} rotation={[0, s * 0.4, 0]} />
      ))}
      <Cyl args={[0.07, 0.05, 0.55, 6]} color="#9ca3af" position={[0, 0.75, 0.68]} rotation={[0.25, 0, 0]} />
      {[-0.2, 0.2].flatMap((x) =>
        [-0.3, 0.25].map((z) => <Cyl key={`${x}${z}`} args={[0.1, 0.1, 0.45, 6]} color="#9ca3af" position={[x, 0.42, z]} />),
      )}
    </group>
  ),
  temple: () => (
    <group>
      <Box size={[1.4, 0.3, 1.4]} color="#f5f5f4" position={[0, 0.15, 0]} />
      <Cyl args={[0.55, 0.6, 0.35, 12]} color="#fde68a" position={[0, 0.48, 0]} />
      <Ball r={0.5} color="#facc15" position={[0, 0.9, 0]} scale={[1, 0.8, 1]} />
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.22, 1.1, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  ),
  sign: () => (
    <group>
      <Cyl args={[0.05, 0.05, 1.6, 6]} color="#64748b" position={[0, 0.8, 0]} />
      <Box size={[1, 0.55, 0.06]} color="#1d4ed8" position={[0, 1.55, 0]} />
      <Box size={[0.8, 0.08, 0.02]} color="#ffffff" position={[0, 1.6, 0.04]} />
      <Box size={[0.6, 0.08, 0.02]} color="#ffffff" position={[0, 1.45, 0.04]} />
    </group>
  ),
  flag: () => (
    <group>
      <Cyl args={[0.04, 0.04, 2.6, 6]} color="#e5e7eb" position={[0, 1.3, 0]} />
      <Box size={[0.03, 0.45, 0.7]} color="#dc2626" position={[0, 2.35, 0.36]} />
    </group>
  ),
}

// A gem bobbing over a spot whose word has been passed.
function PassedGem() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 1.5
    ref.current.position.y = 2.9 + Math.sin(clock.elapsedTime * 2) * 0.1
  })
  return (
    <mesh ref={ref} position={[0, 2.9, 0]}>
      <octahedronGeometry args={[0.18]} />
      <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} />
    </mesh>
  )
}

// `passed` is the set of spot ids whose word has been said well;
// onSelect(spot) runs when one is tapped.
export default function TownDecor({ passed, onSelect }) {
  return TOWN_SPOTS.map((spot) => {
    const Model = MODELS[spot.kind]
    const [x, z] = spot.position
    return (
      <group
        key={spot.id}
        position={[x, 0, z]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.(spot)
        }}
      >
        <group rotation={[0, Math.atan2(-x, -z), 0]}>
          <Model />
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[1.05, 1.2, 32]} />
          <meshBasicMaterial color={passed.has(spot.id) ? '#22c55e' : '#fde047'} transparent opacity={0.7} />
        </mesh>
        {passed.has(spot.id) && <PassedGem />}
      </group>
    )
  })
}
