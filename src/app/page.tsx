import dynamic from 'next/dynamic'
import { Header } from '@/components/ui/Header'
import { Tooltip } from '@/components/ui/Tooltip'
import { Overlay } from '@/components/ui/Overlay'
import { NewsPanel } from '@/components/ui/NewsPanel'

/**
 * Dynamic import with ssr:false is critical — Three.js / @react-three/fiber
 * accesses window/document at module evaluation time, which crashes during SSR.
 */
const Scene = dynamic(() => import('@/components/globe/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#080B14]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
        <p className="text-white/30 text-xs tracking-widest uppercase">
          Loading globe…
        </p>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#080B14]">
      {/* 3D Globe canvas — covers the full viewport */}
      <Scene />

      {/* HTML overlay layer — sits on top of the canvas */}
      <Header />
      <Tooltip />
      <Overlay />
      <NewsPanel />

      {/* Bottom hint — fades after first interaction via CSS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-white/25 text-xs text-center tracking-wide">
          Drag to rotate · Scroll to zoom · Click markers to explore
        </p>
      </div>
    </main>
  )
}
