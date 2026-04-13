// src/hooks/useNewsData.ts
'use client'

import { useState, useEffect } from 'react'
import { mockNewsItems } from '@/data/mockNews'
import type { NewsItem } from '@/types/news'

export function useNewsData(): { items: NewsItem[]; isLoading: boolean } {
  const [items, setItems] = useState<NewsItem[]>(mockNewsItems) // start with mock
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/news')
        if (!res.ok) throw new Error('fetch failed')
        const data: NewsItem[] = await res.json()
        // Only replace mock data if we got valid items with real coordinates
        const withCoords = data.filter(n => n.lat !== 0 || n.lng !== 0)
        if (withCoords.length > 0) setItems(withCoords)
      } catch (err) {
        console.warn('API unavailable, using mock data', err)
        // Falls back to mock — globe still works
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return { items, isLoading }
}
