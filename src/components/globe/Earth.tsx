'use client'

/**
 * Earth — pure static mesh. No rotation logic here.
 * Rotation is handled by GlobeGroup so markers and Earth move as one unit.
 */

import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/lib/geoUtils'

export function Earth() {
  const textures = useTexture({
    map:         '/textures/earth_day.jpg',
    normalMap:   '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg',
  })

  // SRGBColorSpace tells Three.js the texture was authored in sRGB (standard
  // for photos/paintings). Without this, colors appear slightly washed out.
  if (textures.map) textures.map.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      {/*
       * meshPhongMaterial (not Standard) — used because it exposes specularMap
       * as a JSX prop, giving the ocean its characteristic reflective sheen.
       */}
      <meshPhongMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        specularMap={textures.specularMap}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        specular={new THREE.Color(0.25, 0.35, 0.55)}
        shininess={14}
      />
    </mesh>
  )
}
