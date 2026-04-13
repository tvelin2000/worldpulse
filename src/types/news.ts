export type NewsCategory =
  | 'politics'
  | 'technology'
  | 'environment'
  | 'economy'
  | 'conflict'
  | 'science'
  | 'health'

export type NewsImpact = 'low' | 'medium' | 'high' | 'critical'

export interface NewsItem {
  id: string
  title: string
  summary: string
  category: NewsCategory
  impact: NewsImpact
  source: string
  sourceUrl: string
  publishedAt: string // ISO 8601
  lat: number        // -90 to 90
  lng: number        // -180 to 180
  country: string
  city: string
  imageUrl?: string
}

export interface GlobeState {
  selectedNews: NewsItem | null
  hoveredId: string | null
  isPanelOpen: boolean
  isAutoRotating: boolean
  setSelectedNews: (item: NewsItem | null) => void
  setHoveredId: (id: string | null) => void
  openPanel: (item: NewsItem) => void
  closePanel: () => void
  setAutoRotating: (v: boolean) => void
}
