import { useFrame } from '@react-three/fiber'

// Keeps a fixed camera pointed at `target`.
export default function LookAt({ target }) {
  useFrame(({ camera }) => camera.lookAt(...target))
  return null
}
