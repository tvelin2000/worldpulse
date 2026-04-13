'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 5000
const STAR_SPHERE_RADIUS = 80

export function Starfield() {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate star positions once — dependency array is empty so this never re-runs
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform distribution on a sphere shell
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = STAR_SPHERE_RADIUS + Math.random() * 20

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Vary star sizes for depth perception
      sizes[i] = Math.random() * 1.5 + 0.3
    }

    return { positions, sizes }
  }, [])

  // Very subtle slow drift — adds life without distraction
  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.75}
        vertexColors={false}
        depthWrite={false}
      />
    </points>
  )
}
