'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/lib/geoUtils'

// Fresnel-based atmospheric glow shader
const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform vec3 uAtmosphereColor;
  uniform float uAtmosphereIntensity;

  void main() {
    // Fresnel: bright at grazing angles (edges), dark when looking straight on
    float viewDot = dot(normalize(vNormal), normalize(vViewPosition));
    float fresnel  = pow(1.0 - abs(viewDot), 3.0);
    float glow     = fresnel * uAtmosphereIntensity;

    gl_FragColor = vec4(uAtmosphereColor, glow);
  }
`

export function Atmosphere() {
  const uniforms = useRef({
    uAtmosphereColor:     { value: new THREE.Color(0.3, 0.6, 1.0) },
    uAtmosphereIntensity: { value: 1.8 },
  })

  return (
    <mesh scale={[1, 1, 1]}>
      {/* Slightly larger than the Earth sphere */}
      <sphereGeometry args={[GLOBE_RADIUS * 1.055, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  )
}
