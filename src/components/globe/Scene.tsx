'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GlobeGroup } from './GlobeGroup'
import { Atmosphere } from './Atmosphere'
import { Starfield } from './Starfield'
import { CameraController } from './CameraController'

/**
 * LIGHTING STRATEGY — why 4 lights?
 *
 * The Earth is a sphere. With a single directional light, the opposite side
 * is completely black — which looks great for realism but terrible for UX
 * (users can't see where markers are located).
 *
 * Solution: layer lights from multiple angles so every part of the globe has
 * enough ambient illumination while still feeling three-dimensional.
 *
 *   1. ambientLight        → flat, uniform fill — prevents pure black shadows
 *   2. directionalLight A  → "sun" from upper-right — warm, primary shading
 *   3. directionalLight B  → cool fill from the left — subtle night-side color
 *   4. directionalLight C  → bottom fill — prevents south pole going black
 */

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent', position: 'absolute', inset: 0 }}
    >
      {/* 1. Uniform fill — ensures no face is ever completely black */}
      <ambientLight intensity={0.45} />

      {/* 2. Primary "sun" — warm directional from upper-right */}
      <directionalLight
        position={[6, 4, 5]}
        intensity={1.4}
        color="#fff8f0"
      />

      {/* 3. Cool fill — blue-tinted light from the opposing side */}
      <directionalLight
        position={[-6, 2, -4]}
        intensity={0.55}
        color="#4060c0"
      />

      {/* 4. Bottom fill — keeps southern hemisphere legible */}
      <directionalLight
        position={[0, -5, 3]}
        intensity={0.25}
        color="#ffffff"
      />

      {/*
       * Suspense boundary: Earth uses useTexture() which suspends rendering
       * until all 3 texture files are downloaded. The fallback is null —
       * the atmosphere and starfield still render while textures load.
       */}
      <Suspense fallback={null}>
        {/*
         * GlobeGroup contains Earth + Markers together.
         * Rotating the group rotates both as one unit — this is the marker fix.
         */}
        <GlobeGroup />

        {/*
         * Atmosphere is OUTSIDE GlobeGroup — it's a visual effect that wraps
         * the whole sphere and should not rotate with it.
         */}
        <Atmosphere />
      </Suspense>

      {/* Stars render immediately (no textures needed) */}
      <Starfield />

      {/* OrbitControls + GSAP camera flyto */}
      <CameraController />
    </Canvas>
  )
}
