import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export const SKY_COLOR = '#aee3ff'

// Sun, sky light and soft distance fog shared by every 3D scene.
export function Lighting() {
  return (
    <>
      <color attach="background" args={[SKY_COLOR]} />
      <fog attach="fog" args={[SKY_COLOR, 28, 60]} />
      <hemisphereLight args={['#ffffff', '#86efac', 0.9]} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />
    </>
  )
}

export function Tree({ position, scale = 1, kind = 'round' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
        <meshStandardMaterial color="#92400e" flatShading />
      </mesh>
      {kind === 'palm' ? (
        [0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[0, 1.9, 0]}
            rotation={[0.9, (i / 5) * Math.PI * 2, 0]}
            castShadow
          >
            <coneGeometry args={[0.25, 1.6, 4]} />
            <meshStandardMaterial color="#16a34a" flatShading />
          </mesh>
        ))
      ) : (
        <mesh position={[0, 1.6, 0]} castShadow>
          <icosahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color="#22c55e" flatShading />
        </mesh>
      )}
    </group>
  )
}

function Cloud({ position, speed }) {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.position.x += speed * delta
    if (ref.current.position.x > 30) ref.current.position.x = -30
  })
  return (
    <group ref={ref} position={position}>
      {[
        [0, 0, 0, 1.2],
        [1.1, -0.2, 0.2, 0.9],
        [-1.1, -0.25, -0.1, 0.85],
        [0.4, 0.5, 0, 0.8],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function Clouds() {
  return (
    <>
      <Cloud position={[-12, 11, -14]} speed={0.4} />
      <Cloud position={[6, 13, -18]} speed={0.25} />
      <Cloud position={[18, 10, -8]} speed={0.35} />
    </>
  )
}
