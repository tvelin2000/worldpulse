'use client'

/**
 * GlobeGroup — the rotating container for Earth + Markers.
 *
 * WHY THIS EXISTS:
 * Three.js (and react-three-fiber) works like a tree:
 *   - Parent transforms (position, rotation, scale) are inherited by children.
 *   - Previously, only the Earth mesh rotated — markers were siblings, so they
 *     stayed fixed while Earth spun underneath them.
 *   - Solution: wrap both Earth and Markers in a single <group>. Rotating the
 *     group rotates everything inside it together. The markers are now perfectly
 *     glued to their geographic coordinates at all times.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGlobeStore } from '@/store/globeStore'
import { Earth } from './Earth'
import { Markers } from './Markers'

// Degrees per second the globe auto-rotates
const AUTO_ROTATE_SPEED = 0.035

export function GlobeGroup() {
  const groupRef = useRef<THREE.Group>(null)
  const isAutoRotating = useGlobeStore((s) => s.isAutoRotating)

  // useFrame runs once per rendered frame (60fps target).
  // We rotate the GROUP — not just the Earth mesh — so markers ride along.
  useFrame((_, delta) => {
    if (!groupRef.current || !isAutoRotating) return
    groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED
  })

  return (
    <group ref={groupRef}>
      {/*
       * Earth mesh + Markers are both children of this group.
       * Any rotation applied to the group propagates to both.
       * latLngToVector3 positions are relative to the group origin (0,0,0),
       * which is the center of the Earth — exactly correct.
       */}
      <Earth />
      <Markers />
    </group>
  )
}
