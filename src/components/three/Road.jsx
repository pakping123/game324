import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import { chunkRange, NPC_SIDE_X, npcFor, npcZ, stopZ } from '../../lib/road.js'
import { playerLook, useGameStore } from '../../store/useGameStore.js'
import Character from './Character.jsx'
import { SKY_COLOR } from './Scenery.jsx'
import SpotProp from './SpotProps.jsx'
import StreetChunk from './StreetParts.jsx'

const SPEED = 3.4
const ARRIVE_DISTANCE = 0.05
const TURN_SPEED = 8
const CAMERA_OFFSET = [0, 3.4, 6.5]
// Portrait phones see less to the sides, so pull the camera further back.
const PORTRAIT_ZOOM = 1.35
const CAMERA_FOLLOW = 3
const LOOK_AHEAD = 3
const FACING_FORWARD = Math.PI
// The talk panel covers the right side of wide screens (see .road-sheet) and
// the bottom of narrow ones. While talking, pan or tilt the camera so the two
// people stay in the part of the screen left free.
const WIDE_SCREEN = 900
const WIDE_PAN = 1.6
const NARROW_RAISE = 2.2
const NARROW_TILT = 2.6

const NPC_MOTION = { idle: 'idle', talking: 'talk', happy: 'happy', confused: 'confused' }
// The emoji bubble floats this high over the person's feet.
const BUBBLE_HEIGHT = 2.35
const BUBBLE_BOB = 0.08
// Where the thing that shows the talk's topic stands, from the person.
const SPOT_OUT = 1.3
const SPOT_BACK = -0.9

// Sun that moves along with the player, so shadows work however far they walk.
function FollowSun({ follow }) {
  const light = useRef()
  useFrame(() => {
    const z = follow.current?.position.z ?? 0
    light.current.position.set(7, 14, z + 5)
    light.current.target.position.set(0, 0, z - 4)
    light.current.target.updateMatrixWorld()
  })
  return (
    <directionalLight
      ref={light}
      intensity={1.6}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-14}
      shadow-camera-right={14}
      shadow-camera-top={14}
      shadow-camera-bottom={-14}
      shadow-bias={-0.0005}
    />
  )
}

// The player: walks down the street to the stop point for person `step`
// (unless `paused`), calls onArrive(step) once there, and turns to face them
// while talking. The camera and the sun follow from behind.
function Walker({ step, talking, paused, onArrive }) {
  const outfit = useGameStore(playerLook)
  const follow = useRef()
  const motion = useRef('idle')
  const arrived = useRef(-1)
  const look = useRef(new Vector3(0, 1, -LOOK_AHEAD))

  useFrame((state, delta) => {
    const body = follow.current
    const pos = body.position
    const targetZ = paused ? pos.z : stopZ(step)
    const dist = pos.z - targetZ
    const npc = npcFor(step)
    const npcX = npc.side * NPC_SIDE_X

    let facing = FACING_FORWARD
    if (dist > ARRIVE_DISTANCE) {
      pos.z -= Math.min(dist, SPEED * delta)
      motion.current = 'walk'
    } else {
      motion.current = 'idle'
      if (!paused && arrived.current !== step) {
        arrived.current = step
        onArrive(step)
      }
      if (talking) facing = Math.atan2(npcX - pos.x, npcZ(step) - pos.z)
    }
    let turn = facing - body.rotation.y
    turn = Math.atan2(Math.sin(turn), Math.cos(turn))
    body.rotation.y += turn * Math.min(1, delta * TURN_SPEED)

    // While talking, frame both people; while walking, look down the street.
    const k = 1 - Math.exp(-CAMERA_FOLLOW * delta)
    const zoom = state.size.width < state.size.height ? PORTRAIT_ZOOM : 1
    const wide = state.size.width >= WIDE_SCREEN
    const pan = talking && wide ? WIDE_PAN : 0
    const raise = talking && !wide ? NARROW_RAISE : 0
    const sideShift = talking ? -npc.side * 0.8 : 0
    const cam = state.camera
    cam.position.x += (pos.x + sideShift + pan + CAMERA_OFFSET[0] * zoom - cam.position.x) * k
    cam.position.y += (CAMERA_OFFSET[1] * zoom + raise - cam.position.y) * k
    cam.position.z += (pos.z + CAMERA_OFFSET[2] * zoom - cam.position.z) * k
    const lookX = (talking ? npcX / 2 : pos.x) + pan
    const lookY = talking && !wide ? 1.1 - NARROW_TILT : 1.1
    const lookZ = talking ? (pos.z + npcZ(step)) / 2 : pos.z - LOOK_AHEAD
    look.current.x += (lookX - look.current.x) * k
    look.current.y += (lookY - look.current.y) * k
    look.current.z += (lookZ - look.current.z) * k
    cam.lookAt(look.current)
  })

  return (
    <>
      <FollowSun follow={follow} />
      <group ref={follow} rotation={[0, FACING_FORWARD, 0]}>
        <Character {...outfit} motionRef={motion} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.45, 0.55, 24]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
        </mesh>
      </group>
    </>
  )
}

// Keeps the emoji speech bubble (a DOM element outside the canvas, from
// RoadScreen) over the head of person `step`. drei's <Html> would do this,
// but its React roots get lost under StrictMode.
function BubbleTracker({ step, bubbleRef }) {
  const v = useMemo(() => new Vector3(), [])
  useFrame(({ camera, size, clock }) => {
    const el = bubbleRef.current
    if (!el) return
    const npc = npcFor(step)
    const bob = Math.sin(clock.elapsedTime * 3) * BUBBLE_BOB
    v.set(npc.side * NPC_SIDE_X, BUBBLE_HEIGHT + bob, npcZ(step)).project(camera)
    el.style.visibility = v.z < 1 ? 'visible' : 'hidden'
    el.style.transform = `translate(-50%, -100%) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`
  })
  return null
}

// A person on the road, with something beside them that fits what they talk
// about (`cat`, see SpotProps).
function RoadPerson({ step, motion, cat }) {
  const npc = npcFor(step)
  const x = npc.side * NPC_SIDE_X
  // Face the player coming up the middle of the street.
  const facing = Math.atan2(-x, 1.5)
  return (
    <group position={[x, 0, npcZ(step)]}>
      <Character {...npc.look} motion={motion} rotation={[0, facing, 0]} />
      <SpotProp
        cat={cat}
        position={[npc.side * SPOT_OUT, 0, SPOT_BACK]}
        rotation={[0, (-npc.side * Math.PI) / 2, 0]}
        scale={0.8}
      />
    </group>
  )
}

// The endless street. `step` is the person the player is walking to (or
// talking with, when `talking`); `mood` is how that person looks:
// 'idle' | 'talking' | 'happy' | 'confused'. The previous person stays in
// place, waving goodbye. Nobody moves while `paused`. `cat` and `prevCat` are
// the topics of the current and previous person's talks; `bubbleRef` is the
// emoji bubble to keep over the current person.
export default function Road({ step, talking, mood, paused, onArrive, cat, prevCat, bubbleRef }) {
  return (
    <>
      <color attach="background" args={[SKY_COLOR]} />
      <fog attach="fog" args={[SKY_COLOR, 22, 52]} />
      <hemisphereLight args={['#ffffff', '#86efac', 0.9]} />
      {chunkRange(step).map((i) => (
        <StreetChunk key={i} index={i} />
      ))}
      {step > 0 && <RoadPerson key={step - 1} step={step - 1} motion="happy" cat={prevCat} />}
      <RoadPerson key={step} step={step} motion={NPC_MOTION[mood] ?? 'idle'} cat={cat} />
      <BubbleTracker step={step} bubbleRef={bubbleRef} />
      <Walker
        step={step}
        talking={talking}
        paused={paused}
        onArrive={onArrive}
      />
    </>
  )
}
