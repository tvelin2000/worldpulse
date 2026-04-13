import { create } from 'zustand'
import type { GlobeState, NewsItem } from '@/types/news'

export const useGlobeStore = create<GlobeState>((set) => ({
  selectedNews: null,
  hoveredId: null,
  isPanelOpen: false,
  isAutoRotating: true,

  setSelectedNews: (item: NewsItem | null) => set({ selectedNews: item }),
  setHoveredId: (id: string | null) => set({ hoveredId: id }),

  openPanel: (item: NewsItem) =>
    set({ selectedNews: item, isPanelOpen: true, isAutoRotating: false }),

  closePanel: () =>
    set({ isPanelOpen: false, isAutoRotating: true, selectedNews: null }),

  setAutoRotating: (v: boolean) => set({ isAutoRotating: v }),
}))
