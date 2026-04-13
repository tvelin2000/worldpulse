'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import gsap from 'gsap'
import { latLngToVector3 } from '@/lib/geoUtils'
import { useGlobeStore } from '@/store/globeStore'
import { GSAP_EASES } from '@/lib/animations'

export function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const selectedNews   = useGlobeStore((s) => s.selectedNews)
  const isAutoRotating = useGlobeStore((s) => s.isAutoRotating)

  useEffect(() => {
    if (!selectedNews || !controlsRef.current) return

    // Compute camera target: slightly further than the globe surface in the marker's direction
    const markerPos = latLngToVector3(selectedNews.lat, selectedNews.lng)
    const camTarget = markerPos.clone().normalize().multiplyScalar(4.5)

    // Disable orbit controls during the tween to prevent jitter
    controlsRef.current.enabled = false

    // GSAP context ensures the tween is killed if selectedNews changes before completion
    const ctx = gsap.context(() => {
      gsap.to(camera.position, {
        x: camTarget.x,
        y: camTarget.y,
        z: camTarget.z,
        duration: 1.4,
        ease: GSAP_EASES.smooth,
        onUpdate: () => camera.lookAt(0, 0, 0),
        onComplete: () => {
          if (controlsRef.current) controlsRef.current.enabled = true
        },
      })
    })

    return () => ctx.revert()
  }, [selectedNews, camera])

  // Re-enable controls when panel closes
  useEffect(() => {
    if (!controlsRef.current) return
    if (isAutoRotating) {
      // Animate camera back to default position
      const ctx = gsap.context(() => {
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 6,
          duration: 1.2,
          ease: GSAP_EASES.smooth,
          onUpdate: () => camera.lookAt(0, 0, 0),
        })
      })
      return () => ctx.revert()
    }
  }, [isAutoRotating, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom
      minDistance={3}
      maxDistance={8}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      autoRotate={false} // Globe mesh handles its own rotation
    />
  )
}
