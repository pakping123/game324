// Something next to a person on the road that shows what they will talk
// about: a bus stop sign for travel, a signpost for directions, a little
// stall for paying and food. Built facing +z (toward the street).

function Box({ size, color, ...props }) {
  return (
    <mesh castShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

function BusStopSign() {
  return (
    <group>
      <Box size={[0.08, 2.4, 0.08]} color="#94a3b8" position={[0, 1.2, 0]} />
      <mesh position={[0, 2.35, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 20]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <Box size={[0.36, 0.2, 0.02]} color="#ffffff" position={[0, 2.35, 0.09]} />
      {/* bench */}
      <Box size={[1.1, 0.08, 0.4]} color="#b45309" position={[0.8, 0.45, -0.1]} />
      {[0.35, 1.25].map((x) => (
        <Box key={x} size={[0.08, 0.45, 0.35]} color="#57534e" position={[x, 0.22, -0.1]} />
      ))}
    </group>
  )
}

// Arrow boards pointing different ways. `tip` is a small triangle at the end.
function Arrow({ color, y, turn }) {
  return (
    <group position={[0, y, 0]} rotation={[0, turn, 0]}>
      <Box size={[0.9, 0.24, 0.05]} color={color} position={[0.45, 0, 0]} />
      <mesh position={[0.98, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.2, 0.2, 3]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

function Signpost() {
  return (
    <group>
      <Box size={[0.1, 2.6, 0.1]} color="#78350f" position={[0, 1.3, 0]} />
      <Arrow color="#16a34a" y={2.3} turn={0.4} />
      <Arrow color="#2563eb" y={1.95} turn={Math.PI - 0.3} />
      <Arrow color="#dc2626" y={1.6} turn={Math.PI / 2 + 0.2} />
    </group>
  )
}

const FRUIT = ['#facc15', '#f97316', '#22c55e', '#ef4444', '#a855f7']

function Stall({ canopy }) {
  return (
    <group>
      <Box size={[1.4, 0.8, 0.7]} color="#a16207" position={[0, 0.4, 0]} />
      {[-0.65, 0.65].map((x) => (
        <Box key={x} size={[0.06, 1.9, 0.06]} color="#78350f" position={[x, 0.95, -0.3]} />
      ))}
      <Box size={[1.6, 0.08, 1]} color={canopy} position={[0, 1.9, -0.05]} rotation={[0.15, 0, 0]} />
      {FRUIT.map((color, i) => (
        <mesh key={color} position={[-0.5 + i * 0.25, 0.9, 0.05 + (i % 2) * 0.15]} castShadow>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

const BY_CAT = {
  travel: BusStopSign,
  directions: Signpost,
  pay: () => <Stall canopy="#16a34a" />,
  food: () => <Stall canopy="#ef4444" />,
}

export default function SpotProp({ cat, ...groupProps }) {
  const Prop = BY_CAT[cat]
  if (!Prop) return null
  return (
    <group {...groupProps}>
      <Prop />
    </group>
  )
}
