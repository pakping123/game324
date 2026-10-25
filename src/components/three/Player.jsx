import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MAP_RADIUS } from '../../data/zones.js'
import { playerLook, useGameStore } from '../../store/useGameStore.js'
import Character from './Character.jsx'

const SPEED = 4.5
const ARRIVE_DISTANCE = 0.08
const CAMERA_OFFSET = [0, 14, 10]
// Look a little ahead of the player, so more of the town above them shows.
const LOOK_AHEAD = 2
// Portrait phones see less to the sides, so pull the camera further back.
const PORTRAIT_ZOOM = 1.45
const CAMERA_FOLLOW = 3

// The player's character. Walks toward `target` ([x, z]) and calls onArrive
// once on reaching it; onMove(x, z) is called on every frame of walking. The
// camera follows from above and behind.
export default function Player({ start, target, onArrive, onMove }) {
  const look = useGameStore(playerLook)
  const group = useRef()
  const motion = useRef('idle')
  const arrivedAt = useRef(null)

  useFrame((state, delta) => {
    const pos = group.current.position
    const [tx, tz] = target
    const dx = tx - pos.x
    const dz = tz - pos.z
    const dist = Math.hypot(dx, dz)

    if (dist > ARRIVE_DISTANCE) {
      const step = Math.min(dist, SPEED * delta)
      pos.x += (dx / dist) * step
      pos.z += (dz / dist) * step
      const r = Math.hypot(pos.x, pos.z)
      if (r > MAP_RADIUS) {
        pos.x *= MAP_RADIUS / r
        pos.z *= MAP_RADIUS / r
      }
      const facing = Math.atan2(dx, dz)
      let turn = facing - group.current.rotation.y
      turn = Math.atan2(Math.sin(turn), Math.cos(turn))
      group.current.rotation.y += turn * Math.min(1, delta * 12)
      motion.current = 'walk'
      arrivedAt.current = null
      onMove?.(pos.x, pos.z)
    } else {
      motion.current = 'idle'
      if (arrivedAt.current !== target) {
        arrivedAt.current = target
        onArrive?.()
      }
    }

    const k = 1 - Math.exp(-CAMERA_FOLLOW * delta)
    const zoom = state.size.width < state.size.height ? PORTRAIT_ZOOM : 1
    const cam = state.camera
    cam.position.x += (pos.x + CAMERA_OFFSET[0] * zoom - cam.position.x) * k
    cam.position.y += (pos.y + CAMERA_OFFSET[1] * zoom - cam.position.y) * k
    cam.position.z += (pos.z + CAMERA_OFFSET[2] * zoom - cam.position.z) * k
    cam.lookAt(pos.x, 0.8, pos.z - LOOK_AHEAD)
  })

  return (
    <group ref={group} position={[start[0], 0, start[1]]}>
      <Character {...look} motionRef={motion} />
      {/* soft marker ring under the player */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.45, 0.55, 24]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}
