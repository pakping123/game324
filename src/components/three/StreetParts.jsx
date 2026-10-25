import { memo } from 'react'
import { CHUNK_LENGTH, chunkLayout } from '../../lib/road.js'
import { BusStop, MarketStall, StripedAwning } from './Buildings.jsx'
import { Tree } from './Scenery.jsx'

// One chunk of the endless Thai street the road game walks along: asphalt,
// pavements with red-and-white kerbs, a shophouse (ตึกแถว) on each side with
// something in front of it, electricity poles with their wires, and now and
// then a parked tuk-tuk. Everything comes from chunkLayout(index), so a chunk
// looks the same each time it is drawn.

const ROAD_HALF = 3
const PAVEMENT = 1.8
const FACADE_X = ROAD_HALF + PAVEMENT
const HOUSE_DEPTH = 3.2
const GROUND_FLOOR = 2.6
const FLOOR = 2.4
const POLE_HEIGHT = 6.8
const KERB_PIECES = 4

function Block({ size, color, shadow = false, ...props }) {
  return (
    <mesh castShadow={shadow} receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

// A shophouse built facing +z, its front wall at z = 0.
function Shophouse({ house }) {
  const width = CHUNK_LENGTH - 0.15
  const height = GROUND_FLOOR + (house.floors - 1) * FLOOR
  return (
    <group>
      <Block size={[width, height, HOUSE_DEPTH]} color={house.facade} position={[0, height / 2, -HOUSE_DEPTH / 2]} shadow />
      {/* ground floor: open shop fronts, or roller shutters */}
      {[-width / 4, width / 4].map((x) => (
        <Block
          key={x}
          size={[width / 2 - 0.5, 2.1, 0.06]}
          color={house.shutterOpen ? '#3f3f46' : '#a1a1aa'}
          position={[x, 1.05, 0.02]}
        />
      ))}
      <Block size={[0.3, height, 0.12]} color="#f8fafc" position={[0, height / 2, 0.04]} />
      <StripedAwning width={width - 0.4} depth={1.2} y={2.45} colors={[house.awning, '#fff7ed']} />
      {/* shop sign */}
      <Block size={[width * 0.7, 0.6, 0.12]} color={house.sign} position={[0, 3.05, 0.08]} />
      <Block size={[width * 0.45, 0.22, 0.03]} color="#ffffff" position={[0, 3.05, 0.16]} />
      {/* windows upstairs */}
      {Array.from({ length: house.floors - 1 }, (_, f) =>
        [-width / 4, width / 4].map((x) => (
          <group key={`${f}${x}`} position={[x, GROUND_FLOOR + f * FLOOR + 1.25, 0]}>
            <Block size={[1.5, 1.05, 0.06]} color="#93c5fd" position={[0, 0, 0.02]} />
            <Block size={[1.7, 0.1, 0.25]} color="#f8fafc" position={[0, -0.6, 0.1]} />
          </group>
        )),
      )}
      <Block size={[width + 0.1, 0.25, HOUSE_DEPTH + 0.2]} color="#e5e7eb" position={[0, height + 0.12, -HOUSE_DEPTH / 2]} />
    </group>
  )
}

function Pots() {
  return (
    <group>
      {[-0.6, 0, 0.6].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.15, 0.4, 8]} />
            <meshStandardMaterial color="#c2410c" flatShading />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#16a34a" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Wheel({ position, radius = 0.25 }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[radius, radius, 0.12, 12]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
  )
}

// Parked motorbike, pointing along x.
function Motorbike() {
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <Wheel position={[0, 0.25, 0.55]} />
      <Wheel position={[0, 0.25, -0.55]} />
      <Block size={[0.3, 0.3, 1.0]} color="#dc2626" position={[0, 0.55, 0]} shadow />
      <Block size={[0.32, 0.12, 0.55]} color="#111827" position={[0, 0.75, -0.15]} />
      <Block size={[0.6, 0.06, 0.06]} color="#9ca3af" position={[0, 1.0, 0.45]} />
    </group>
  )
}

const SIDEWALK_PROPS = {
  stall: () => <MarketStall />,
  tree: () => <Tree position={[0, 0, 0]} />,
  palm: () => <Tree position={[0, 0, 0]} kind="palm" />,
  pots: Pots,
  busStop: () => <BusStop />,
  motorbike: Motorbike,
}

// Where each prop stands in front of the shophouse, and how big it is.
const PROP_PLACE = {
  stall: { position: [-1.6, 0, 0.45], scale: 0.6 },
  tree: { position: [2, 0, 1.1], scale: 0.9 },
  palm: { position: [2, 0, 1.1], scale: 1 },
  pots: { position: [1.8, 0, 0.5], scale: 1 },
  busStop: { position: [0.5, 0, 0.6], scale: 0.7 },
  motorbike: { position: [-1.5, 0, 1.2], scale: 1 },
}

function StreetSide({ side, house }) {
  const Prop = SIDEWALK_PROPS[house.prop]
  return (
    // Turn the shophouse's front (+z) toward the middle of the street.
    <group position={[side * FACADE_X, 0, 0]} rotation={[0, (-side * Math.PI) / 2, 0]}>
      <Shophouse house={house} />
      {Prop && (
        <group {...PROP_PLACE[house.prop]}>
          <Prop />
        </group>
      )}
    </group>
  )
}

function TukTuk({ side }) {
  return (
    <group position={[side * (ROAD_HALF - 0.8), 0, 0]}>
      <Block size={[1.1, 0.7, 1.5]} color="#1d4ed8" position={[0, 0.65, 0.3]} shadow />
      <Block size={[0.8, 0.6, 0.8]} color="#2563eb" position={[0, 0.7, -0.75]} shadow />
      <Block size={[1.2, 0.08, 2.4]} color="#facc15" position={[0, 1.75, -0.05]} shadow />
      {[-0.5, 0.5].map((x) => (
        <Block key={x} size={[0.06, 0.8, 0.06]} color="#cbd5e1" position={[x, 1.35, 0.95]} />
      ))}
      <Block size={[1.0, 0.06, 0.06]} color="#cbd5e1" position={[0, 1.35, -1.05]} />
      <Wheel position={[0, 0.25, -1.05]} />
      <Wheel position={[-0.55, 0.25, 0.7]} />
      <Wheel position={[0.55, 0.25, 0.7]} />
    </group>
  )
}

// Electricity pole with its crossbar, and the wires running to the next pole.
function PoleAndWires() {
  const x = -(ROAD_HALF + 0.4)
  return (
    <group>
      <mesh position={[x, POLE_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, POLE_HEIGHT, 6]} />
        <meshStandardMaterial color="#9ca3af" flatShading />
      </mesh>
      <Block size={[1.4, 0.1, 0.1]} color="#6b7280" position={[x, POLE_HEIGHT - 0.4, 0]} />
      {[-0.6, -0.1, 0.4].map((dx, i) => (
        <mesh key={dx} position={[x + dx, POLE_HEIGHT - 0.35 - i * 0.12, -CHUNK_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, CHUNK_LENGTH, 4]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
      ))}
    </group>
  )
}

function Pavement({ side }) {
  const pieceLength = CHUNK_LENGTH / KERB_PIECES
  return (
    <group position={[side * (ROAD_HALF + PAVEMENT / 2), 0, 0]}>
      <Block size={[PAVEMENT, 0.14, CHUNK_LENGTH]} color="#d6d3d1" position={[0, 0.07, 0]} />
      {Array.from({ length: KERB_PIECES }, (_, i) => (
        <Block
          key={i}
          size={[0.2, 0.18, pieceLength]}
          color={i % 2 ? '#f8fafc' : '#dc2626'}
          position={[-side * (PAVEMENT / 2 - 0.1), 0.09, -CHUNK_LENGTH / 2 + pieceLength * (i + 0.5)]}
        />
      ))}
    </group>
  )
}

function StreetChunk({ index }) {
  const layout = chunkLayout(index)
  const z = -(index + 0.5) * CHUNK_LENGTH
  return (
    <group position={[0, 0, z]}>
      {/* land behind the houses, then the road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[60, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#86d97a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[ROAD_HALF * 2, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <Pavement side={-1} />
      <Pavement side={1} />
      <StreetSide side={-1} house={layout.left} />
      <StreetSide side={1} house={layout.right} />
      <group position={[0, 0, CHUNK_LENGTH / 2]}>
        <PoleAndWires />
      </group>
      {layout.tuktuk !== 0 && <TukTuk side={layout.tuktuk} />}
    </group>
  )
}

// Re-drawing a chunk is wasted work: it only depends on its index.
export default memo(StreetChunk)
