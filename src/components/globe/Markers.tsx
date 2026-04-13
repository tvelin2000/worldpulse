'use client'

import { Marker } from './Marker'
import { useNewsData } from '@/hooks/useNewsData'

/**
 * Renders all news markers on the globe.
 * Iterates over the news data and renders a <Marker> per item.
 * 15-20 markers = individual meshes are fine (no InstancedMesh needed).
 */
export function Markers() {
  const { items } = useNewsData()

  return (
    <>
      {items.map((news) => (
        <Marker key={news.id} news={news} />
      ))}
    </>
  )
}
