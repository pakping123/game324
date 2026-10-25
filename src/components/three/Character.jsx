import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

// A chibi low-poly person built from primitives, dressed by its look (see
// data/looks.js): hairStyle 'short' | 'long' | 'bun' | 'ponytail',
// shirtStyle 'tee' | 'collar' | 'stripes', bottomType 'longyi' | 'pants' |
// 'skirt', hat 'none' | 'ngob' (the wide farmer's hat) | 'cap', and thanaka
// on the cheeks, glasses and a shoulder bag.
//
// motion: 'idle' | 'walk' | 'talk' | 'happy' | 'confused'. Pass `motionRef`
// instead when the motion changes every frame (e.g. walking), so the parent
// doesn't need to re-render.
export default function Character({
  shirt = '#38bdf8',
  shirtStyle = 'tee',
  bottom = '#7c3aed',
  bottomType = 'longyi',
  skin = '#e0ac69',
  hair = '#1f130b',
  hairStyle = 'short',
  hat = 'none',
  apron = null,
  thanaka = false,
  glasses = false,
  bag = false,
  motion = 'idle',
  motionRef,
  ...groupProps
}) {
  const body = useRef()
  const head = useRef()
  const armL = useRef()
  const armR = useRef()
  const footL = useRef()
  const footR = useRef()
  const lower = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const m = motionRef?.current ?? motion
    let bob = Math.sin(t * 2) * 0.015
    let swing = 0
    let armsUp = 0
    let nod = 0
    let tilt = 0

    if (m === 'walk') {
      swing = Math.sin(t * 11) * 0.6
      bob = Math.abs(Math.sin(t * 11)) * 0.06
    } else if (m === 'talk') {
      nod = Math.sin(t * 9) * 0.12
      armsUp = 0.4 + Math.sin(t * 5) * 0.3
    } else if (m === 'happy') {
      bob = Math.abs(Math.sin(t * 7)) * 0.3
      armsUp = 2.6
    } else if (m === 'confused') {
      tilt = 0.35
      armsUp = 0.9
    }

    body.current.position.y = bob
    head.current.rotation.x = nod
    head.current.rotation.z = tilt
    armL.current.rotation.x = swing
    armR.current.rotation.x = -swing
    armL.current.rotation.z = armsUp
    armR.current.rotation.z = -armsUp
    footL.current.position.z = Math.sin(t * 11) * 0.12 * (m === 'walk' ? 1 : 0)
    footR.current.position.z = -footL.current.position.z
    lower.current.rotation.x = swing * 0.08
  })

  return (
    <group {...groupProps}>
      <group ref={body}>
        {/* feet */}
        <mesh ref={footL} position={[-0.12, 0.05, 0]} castShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
        <mesh ref={footR} position={[0.12, 0.05, 0]} castShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
        <group ref={lower}>
          <Bottom type={bottomType} color={bottom} skin={skin} />
        </group>
        {/* torso */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.27, 0.48, 10]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>
        <ShirtDetail style={shirtStyle} />
        {apron && (
          <mesh position={[0, 0.66, 0.24]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.04]} />
            <meshStandardMaterial color={apron} />
          </mesh>
        )}
        {bag && <ShoulderBag />}
        {/* arms pivot at the shoulders */}
        <group ref={armL} position={[-0.3, 1.06, 0]}>
          <Arm shirt={shirt} skin={skin} />
        </group>
        <group ref={armR} position={[0.3, 1.06, 0]}>
          <Arm shirt={shirt} skin={skin} />
        </group>
        {/* head */}
        <group ref={head} position={[0, 1.45, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.33, 16, 14]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <Hair style={hairStyle} color={hair} />
          {/* eyes */}
          <mesh position={[-0.11, 0.02, 0.3]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0.11, 0.02, 0.3]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {glasses && <Glasses />}
          {/* smile */}
          <mesh position={[0, -0.1, 0.3]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.06, 0.015, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#7f1d1d" />
          </mesh>
          {thanaka && (
            <>
              <mesh position={[-0.19, -0.06, 0.25]} rotation={[0, -0.6, 0]}>
                <circleGeometry args={[0.07, 12]} />
                <meshStandardMaterial color="#f5deb3" />
              </mesh>
              <mesh position={[0.19, -0.06, 0.25]} rotation={[0, 0.6, 0]}>
                <circleGeometry args={[0.07, 12]} />
                <meshStandardMaterial color="#f5deb3" />
              </mesh>
            </>
          )}
          <Hat type={hat} color={shirt} />
        </group>
      </group>
    </group>
  )
}

function Arm({ shirt, skin }) {
  return (
    <>
      <mesh position={[0, -0.21, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.06, 0.42, 6]} />
        <meshStandardMaterial color={shirt} flatShading />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={skin} />
      </mesh>
    </>
  )
}

function Bottom({ type, color, skin }) {
  if (type === 'pants') {
    return (
      <>
        <mesh position={[0, 0.58, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 10]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
        ))}
      </>
    )
  }
  if (type === 'skirt') {
    return (
      <>
        <mesh position={[0, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.36, 0.34, 12]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
        {[-0.11, 0.11].map((x) => (
          <mesh key={x} position={[x, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
            <meshStandardMaterial color={skin} />
          </mesh>
        ))}
      </>
    )
  }
  // longyi / sarong
  return (
    <mesh position={[0, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.26, 0.31, 0.6, 10]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

function ShirtDetail({ style }) {
  if (style === 'collar') {
    return [-1, 1].map((side) => (
      <mesh key={side} position={[side * 0.07, 1.08, 0.17]} rotation={[0.5, 0, side * 0.7]}>
        <boxGeometry args={[0.14, 0.05, 0.12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    ))
  }
  if (style === 'stripes') {
    // Bands just outside the torso, which narrows from 0.27 at the waist
    // (y 0.64) to 0.24 at the shoulders (y 1.12).
    const radius = (y) => 0.27 - ((y - 0.64) / 0.48) * 0.03 + 0.01
    return [0.76, 0.92].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <cylinderGeometry args={[radius(y + 0.025), radius(y - 0.025), 0.05, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    ))
  }
  return null
}

function Hair({ style, color }) {
  const cap = (
    <mesh position={[0, 0.08, -0.02]} scale={[1.05, 0.85, 1.05]}>
      <sphereGeometry args={[0.33, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
  if (style === 'long') {
    return (
      <>
        {cap}
        <mesh position={[0, -0.12, -0.18]}>
          <boxGeometry args={[0.5, 0.45, 0.16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* side locks, so long hair shows from the front too */}
        {[-0.29, 0.29].map((x) => (
          <mesh key={x} position={[x, -0.12, 0.02]}>
            <boxGeometry args={[0.1, 0.42, 0.3]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </>
    )
  }
  if (style === 'bun') {
    return (
      <>
        {cap}
        <mesh position={[0, 0.24, -0.24]}>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </>
    )
  }
  if (style === 'ponytail') {
    return (
      <>
        {cap}
        <mesh position={[0, -0.08, -0.36]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.04, 0.42, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </>
    )
  }
  return cap
}

function Hat({ type, color }) {
  if (type === 'ngob') {
    // งอบ: the wide conical farmer's hat
    return (
      <mesh position={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.62, 0.28, 16]} />
        <meshStandardMaterial color="#e9c46a" flatShading />
      </mesh>
    )
  }
  if (type === 'cap') {
    return (
      <group position={[0, 0.12, 0]}>
        <mesh scale={[1.08, 0.75, 1.08]}>
          <sphereGeometry args={[0.33, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.02, 0.3]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.26]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    )
  }
  return null
}

function Glasses() {
  return (
    <group position={[0, 0.02, 0.32]}>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <torusGeometry args={[0.075, 0.015, 6, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
      <mesh>
        <boxGeometry args={[0.07, 0.015, 0.015]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

function ShoulderBag() {
  return (
    <>
      {/* strap across the chest and the back */}
      {[0.27, -0.27].map((z) => (
        <mesh key={z} position={[0, 0.86, z]} rotation={[0, 0, 0.8]}>
          <boxGeometry args={[0.04, 0.62, 0.02]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
      <mesh position={[0.3, 0.62, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.24, 0.26]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
    </>
  )
}
