'use client'

import { useRef, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { latLngToVector3, CATEGORY_COLORS, GLOBE_RADIUS } from '@/lib/geoUtils'
import { useGlobeStore } from '@/store/globeStore'
import type { NewsItem } from '@/types/news'

interface MarkerProps {
  news: NewsItem
}

// Shared ring material instance — avoids allocating a new GPU material per marker
const ringMaterialTemplate = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide,
  depthWrite: false,
})

export function Marker({ news }: MarkerProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(ringMaterialTemplate.clone())
  const dotRef = useRef<THREE.Mesh>(null)

  const hoveredId      = useGlobeStore((s) => s.hoveredId)
  const selectedNews   = useGlobeStore((s) => s.selectedNews)
  const setHoveredId   = useGlobeStore((s) => s.setHoveredId)
  const openPanel      = useGlobeStore((s) => s.openPanel)

  const isHovered  = hoveredId === news.id
  const isSelected = selectedNews?.id === news.id
  const color      = CATEGORY_COLORS[news.category]

  // Position on the sphere surface + quaternion to orient outward
  const { position, quaternion } = useMemo(() => {
    const position = latLngToVector3(news.lat, news.lng, GLOBE_RADIUS + 0.01)
    const normal   = position.clone().normalize()
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), // ring faces Z by default
      normal,
    )
    return { position, quaternion }
  }, [news.lat, news.lng])

  // Pulse ring: expand scale + fade opacity via sawtooth wave
  useFrame(({ clock }) => {
    if (!ringRef.current || !ringMatRef.current) return
    const pulseSpeed = isSelected ? 1.8 : 1.2
    const t = (clock.getElapsedTime() * pulseSpeed) % 1
    const s = 1 + t * 1.8
    ringRef.current.scale.setScalar(s)
    ringMatRef.current.opacity = (1 - t) * (isSelected ? 0.9 : 0.55)
    ringMatRef.current.color.set(color)
  })

  // Dot scale: grow on hover/select
  useFrame(() => {
    if (!dotRef.current) return
    const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1.0
    dotRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoveredId(news.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoveredId(null)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    openPanel(news)
  }

  return (
    <group position={position} quaternion={quaternion}>
      {/* Pulsing ring — excluded from raycasting */}
      <mesh
        ref={ringRef}
        raycast={() => null}
        material={ringMatRef.current}
      >
        <ringGeometry args={[0.022, 0.034, 32]} />
      </mesh>

      {/* Core dot — the interactive element */}
      <mesh
        ref={dotRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <circleGeometry args={[0.018, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 1.0 : 0.95}
          depthWrite={false}
        />
      </mesh>

      {/* Inner bright core for selected state */}
      {isSelected && (
        <mesh>
          <circleGeometry args={[0.008, 16]} />
          <meshBasicMaterial color="#ffffff" depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
