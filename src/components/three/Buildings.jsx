// Low-poly buildings for each zone of the town. Each faces +z (its door side);
// the town rotates them to face the plaza.

export function Box({ size, color, ...props }) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

export function StripedAwning({ width = 3.2, depth = 1.4, y = 2.2, colors = ['#ef4444', '#fff7ed'] }) {
  const stripes = 8
  const w = width / stripes
  return (
    <group position={[0, y, depth / 2]} rotation={[0.35, 0, 0]}>
      {Array.from({ length: stripes }, (_, i) => (
        <Box
          key={i}
          size={[w, 0.06, depth]}
          color={colors[i % 2]}
          position={[-width / 2 + w / 2 + i * w, 0, 0]}
        />
      ))}
    </group>
  )
}

function Fruit({ color, position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <icosahedronGeometry args={[0.16, 0]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

const FRUIT_COLORS = ['#facc15', '#f97316', '#22c55e', '#ef4444', '#eab308']

export function MarketStall() {
  return (
    <group>
      <Box size={[3, 0.9, 1.2]} color="#a16207" position={[0, 0.45, 0.2]} />
      {[-1.4, 1.4].map((x) => (
        <Box key={x} size={[0.12, 2.4, 0.12]} color="#78350f" position={[x, 1.2, 1]} />
      ))}
      {[-1.4, 1.4].map((x) => (
        <Box key={x} size={[0.12, 2.6, 0.12]} color="#78350f" position={[x, 1.3, -0.5]} />
      ))}
      <StripedAwning />
      {Array.from({ length: 15 }, (_, i) => (
        <Fruit
          key={i}
          color={FRUIT_COLORS[i % FRUIT_COLORS.length]}
          position={[-1.2 + (i % 8) * 0.34, 1 + Math.floor(i / 8) * 0.18, 0.1 + (i % 3) * 0.2]}
        />
      ))}
    </group>
  )
}

export function BusStop() {
  return (
    <group>
      <Box size={[3, 0.12, 1.4]} color="#0284c7" position={[0, 2.2, 0]} />
      {[-1.4, 1.4].map((x) => (
        <Box key={x} size={[0.1, 2.2, 0.1]} color="#94a3b8" position={[x, 1.1, -0.6]} />
      ))}
      <Box size={[2.8, 1.6, 0.06]} color="#bae6fd" position={[0, 1.2, -0.65]} />
      <Box size={[2.2, 0.12, 0.45]} color="#64748b" position={[0, 0.5, -0.3]} />
      {/* bus-stop sign */}
      <Box size={[0.08, 2.8, 0.08]} color="#94a3b8" position={[1.9, 1.4, 0.4]} />
      <mesh position={[1.9, 2.8, 0.4]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 16]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      {/* a little bus waiting */}
      <group position={[0, 0, 2.4]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.5, 1.3, 3.6]} color="#f97316" position={[0, 0.95, 0]} />
        <Box size={[1.52, 0.5, 3.2]} color="#e0f2fe" position={[0, 1.25, 0]} />
        {[-1.1, 1.1].map((z) =>
          [-0.75, 0.75].map((x) => (
            <mesh key={`${x}${z}`} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}

export function SignPosts() {
  const arrows = [
    { y: 2.4, rot: 0.3, color: '#22c55e' },
    { y: 2.0, rot: -0.6, color: '#f59e0b' },
    { y: 1.6, rot: 1.2, color: '#3b82f6' },
  ]
  return (
    <group>
      <Box size={[0.14, 2.8, 0.14]} color="#78350f" position={[0, 1.4, 0]} />
      {arrows.map((a) => (
        <group key={a.y} position={[0, a.y, 0]} rotation={[0, a.rot, 0]}>
          <Box size={[1.2, 0.28, 0.06]} color={a.color} position={[0.55, 0, 0]} />
          <mesh position={[1.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <coneGeometry args={[0.2, 0.3, 3]} />
            <meshStandardMaterial color={a.color} flatShading />
          </mesh>
        </group>
      ))}
      {/* small houses along the soi */}
      {[-2.2, 2.2].map((x, i) => (
        <group key={x} position={[x, 0, -0.8]}>
          <Box size={[1.6, 1.6, 1.6]} color={i ? '#fde68a' : '#fecaca'} position={[0, 0.8, 0]} />
          <mesh position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.35, 0.8, 4]} />
            <meshStandardMaterial color="#b91c1c" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function NoodleShop() {
  return (
    <group>
      <Box size={[3.2, 2.4, 2]} color="#fef3c7" position={[0, 1.2, -0.4]} />
      <Box size={[3.4, 0.3, 2.3]} color="#b91c1c" position={[0, 2.55, -0.4]} />
      <Box size={[1, 1.5, 0.05]} color="#7c2d12" position={[0, 0.75, 0.62]} />
      <StripedAwning width={3.2} depth={1} y={2.1} colors={['#dc2626', '#fde047']} />
      {/* red lanterns */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.75, 1.05]} castShadow>
          <sphereGeometry args={[0.18, 10, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" />
        </mesh>
      ))}
      {/* table and stools out front */}
      <mesh position={[1.6, 0.45, 1.6]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 12]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <Box size={[0.08, 0.45, 0.08]} color="#9ca3af" position={[1.6, 0.22, 1.6]} />
      {[0, 2].map((a) => (
        <mesh key={a} position={[1.6 + Math.cos(a) * 0.75, 0.22, 1.6 + Math.sin(a) * 0.75]} castShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.44, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </group>
  )
}

export function Pharmacy() {
  return (
    <group>
      <Box size={[3, 2.6, 2]} color="#f8fafc" position={[0, 1.3, -0.4]} />
      <Box size={[3.1, 0.4, 2.1]} color="#0d9488" position={[0, 2.7, -0.4]} />
      <Box size={[1.6, 1.4, 0.05]} color="#99f6e4" position={[0, 0.9, 0.62]} />
      {/* green cross sign */}
      <group position={[0, 3.35, 0.2]}>
        <Box size={[0.8, 0.25, 0.12]} color="#22c55e" />
        <Box size={[0.25, 0.8, 0.12]} color="#22c55e" />
      </group>
    </group>
  )
}

export function Factory() {
  return (
    <group>
      <Box size={[4, 2.2, 2.4]} color="#c4b5fd" position={[0, 1.1, -0.6]} />
      {[-1.3, 0, 1.3].map((x) => (
        <mesh key={x} position={[x, 2.45, -0.6]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.9, 0.9, 2.4]} />
          <meshStandardMaterial color="#7c3aed" flatShading />
        </mesh>
      ))}
      <mesh position={[1.6, 3.3, -1.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 2.2, 10]} />
        <meshStandardMaterial color="#a8a29e" flatShading />
      </mesh>
      <Box size={[1.2, 1.4, 0.05]} color="#4c1d95" position={[0, 0.7, 0.62]} />
    </group>
  )
}
