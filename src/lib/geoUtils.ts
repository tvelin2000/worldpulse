import * as THREE from 'three'
import type { NewsCategory } from '@/types/news'

export const GLOBE_RADIUS = 2

/**
 * Convert geographic coordinates to a Three.js Vector3 on a sphere.
 * The -X on the first component is critical to align continents with the texture UV.
 */
export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)  // polar angle from Y-axis
  const theta = (lng + 180) * (Math.PI / 180) // azimuthal angle

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * Get a unit normal vector (outward direction) for a lat/lng position on the sphere.
 * Used to orient markers to face away from the globe surface.
 */
export function latLngToNormal(lat: number, lng: number): THREE.Vector3 {
  return latLngToVector3(lat, lng, 1) // radius 1 = already normalized
}

/**
 * Color coding by news category — used for marker dots and panel accents.
 */
export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  politics:    '#f59e0b',
  technology:  '#3b82f6',
  environment: '#22c55e',
  economy:     '#a855f7',
  conflict:    '#ef4444',
  science:     '#06b6d4',
  health:      '#ec4899',
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  politics:    'Politics',
  technology:  'Technology',
  environment: 'Environment',
  economy:     'Economy',
  conflict:    'Conflict',
  science:     'Science',
  health:      'Health',
}

export const IMPACT_COLORS = {
  low:      '#6b7280',
  medium:   '#f59e0b',
  high:     '#f97316',
  critical: '#ef4444',
}
