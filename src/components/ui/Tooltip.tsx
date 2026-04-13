'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { tooltipVariants } from '@/lib/animations'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/geoUtils'
import { useGlobeStore } from '@/store/globeStore'
import { mockNewsItems } from '@/data/mockNews'

export function Tooltip() {
  const hoveredId = useGlobeStore((s) => s.hoveredId)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const hoveredNews = hoveredId
    ? mockNewsItems.find((n) => n.id === hoveredId) ?? null
    : null

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <AnimatePresence>
      {hoveredNews && (
        <motion.div
          key={hoveredNews.id}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed z-30 pointer-events-none"
          style={{
            left: mousePos.x + 16,
            top:  mousePos.y - 12,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="max-w-[260px] rounded-xl bg-[rgba(10,10,18,0.88)] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-3">
            {/* Category badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[hoveredNews.category] }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: CATEGORY_COLORS[hoveredNews.category] }}
              >
                {CATEGORY_LABELS[hoveredNews.category]}
              </span>
              <span className="text-white/20 text-[10px] ml-auto">
                {hoveredNews.city}, {hoveredNews.country}
              </span>
            </div>

            {/* Title */}
            <p className="text-white/90 text-xs font-medium leading-snug line-clamp-2">
              {hoveredNews.title}
            </p>

            {/* Click hint */}
            <p className="text-white/30 text-[10px] mt-1.5">
              Click to read more →
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
