import { Float } from '@react-three/drei'
import { VENDOR_LOOK } from '../../data/looks.js'
import { MarketStall } from './Buildings.jsx'
import Character from './Character.jsx'
import { Tree } from './Scenery.jsx'

function Mango() {
  return (
    <mesh scale={[0.75, 1, 0.7]} rotation={[0, 0, 0.5]} castShadow>
      <sphereGeometry args={[0.45, 14, 12]} />
      <meshStandardMaterial color="#fbbf24" flatShading />
    </mesh>
  )
}

function Banana() {
  return (
    <group rotation={[0, 0, 0.3]}>
      {[-0.12, 0, 0.12].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI * 0.15]} castShadow>
          <torusGeometry args={[0.45, 0.09, 6, 12, Math.PI * 0.7]} />
          <meshStandardMaterial color="#fde047" flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Watermelon() {
  return (
    <group>
      <mesh scale={[1, 0.85, 0.85]} castShadow>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#15803d" flatShading />
      </mesh>
      {/* a slice beside it */}
      <mesh position={[0.85, -0.25, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  )
}

function Orange() {
  return (
    <group>
      <mesh castShadow>
        <icosahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial color="#f97316" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.8]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  )
}

function Pineapple() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.8, 8]} />
        <meshStandardMaterial color="#eab308" flatShading />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.6, 0]} rotation={[0.35, (i / 5) * Math.PI * 2, 0]} castShadow>
          <coneGeometry args={[0.1, 0.55, 4]} />
          <meshStandardMaterial color="#16a34a" flatShading />
        </mesh>
      ))}
    </group>
  )
}

const GOODS = {
  mango: Mango,
  banana: Banana,
  watermelon: Watermelon,
  orange: Orange,
  pineapple: Pineapple,
}

const VENDOR_MOTION = { idle: 'idle', talking: 'talk', happy: 'happy', confused: 'confused' }

// Close-up of the market stall: the vendor behind her counter, more stalls
// behind, and the fruit being sold or learned, floating in front so the
// player sees what it is. Lit by ZoneScene.
// `stage`: { wordId, mood: 'idle' | 'talking' | 'happy' | 'confused' }
export default function MarketScene({ stage }) {
  const Good = GOODS[stage?.wordId]
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[30, 32]} />
        <meshStandardMaterial color="#86d97a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#e7d8b5" />
      </mesh>
      <MarketStall />
      <group position={[-4.3, 0, -3.2]} rotation={[0, 0.45, 0]} scale={0.85}>
        <MarketStall />
      </group>
      <group position={[4.6, 0, -3.6]} rotation={[0, -0.45, 0]} scale={0.85}>
        <MarketStall />
      </group>
      <Character
        {...VENDOR_LOOK}
        position={[2.05, 0, 0.9]}
        rotation={[0, -0.35, 0]}
        motion={VENDOR_MOTION[stage?.mood] ?? 'idle'}
      />
      {Good && (
        <Float key={stage.wordId} speed={3} floatIntensity={0.8} rotationIntensity={0.8}>
          <group position={[-0.2, 1.6, 1.5]}>
            <Good />
          </group>
        </Float>
      )}
      <Tree position={[-6.4, 0, -1.4]} kind="palm" scale={1.3} />
      <Tree position={[6.6, 0, -1.6]} scale={1.2} />
      <Tree position={[6, 0, -6]} kind="palm" />
      <Tree position={[-6.5, 0, -6]} />
    </>
  )
}
