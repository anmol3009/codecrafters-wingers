import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 600

function Particles() {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      sizes[i] = Math.random() * 0.05 + 0.02
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.008) * 0.04
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#FA8112"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

export default function ParticleField() {
  return (
    <Canvas
      className="absolute inset-0 pointer-events-none"
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <Particles />
    </Canvas>
  )
}
