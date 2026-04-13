'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { panelVariants, staggerContainer, staggerItem } from '@/lib/animations'
import { CATEGORY_COLORS, CATEGORY_LABELS, IMPACT_COLORS } from '@/lib/geoUtils'
import { useGlobeStore } from '@/store/globeStore'

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

export function NewsPanel() {
  const isPanelOpen  = useGlobeStore((s) => s.isPanelOpen)
  const selectedNews = useGlobeStore((s) => s.selectedNews)
  const closePanel   = useGlobeStore((s) => s.closePanel)

  const news = selectedNews

  return (
    <AnimatePresence mode="wait">
      {isPanelOpen && news && (
        <motion.aside
          key={news.id}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed right-0 top-0 bottom-0 z-30 w-full sm:w-[420px] flex flex-col"
          aria-label="News detail panel"
          role="dialog"
        >
          {/* Glass panel */}
          <div className="relative flex flex-col h-full m-3 ml-0 sm:m-4 sm:ml-0 rounded-2xl overflow-hidden bg-[rgba(8,11,20,0.82)] backdrop-blur-[28px] border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_64px_rgba(0,0,0,0.7)]">

            {/* Category accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${CATEGORY_COLORS[news.category]}, transparent)` }}
            />

            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category badge */}
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[news.category]}18`,
                    color: CATEGORY_COLORS[news.category],
                    border: `1px solid ${CATEGORY_COLORS[news.category]}30`,
                  }}
                >
                  {CATEGORY_LABELS[news.category]}
                </span>

                {/* Impact badge */}
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${IMPACT_COLORS[news.impact]}14`,
                    color: IMPACT_COLORS[news.impact],
                    borderColor: `${IMPACT_COLORS[news.impact]}28`,
                  }}
                >
                  {news.impact}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={closePanel}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] transition-colors duration-150 flex-shrink-0 ml-2"
                aria-label="Close panel"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto px-5 pb-5 space-y-5 scrollbar-thin"
            >
              {/* Location */}
              <motion.div variants={staggerItem} className="flex items-center gap-1.5 text-white/40 text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{news.city}, {news.country}</span>
                <span className="text-white/20">·</span>
                <span>{formatDate(news.publishedAt)}</span>
              </motion.div>

              {/* Title */}
              <motion.h2
                variants={staggerItem}
                className="text-white font-semibold text-lg leading-snug tracking-tight"
              >
                {news.title}
              </motion.h2>

              {/* Divider */}
              <motion.div variants={staggerItem} className="h-px bg-white/[0.06]" />

              {/* Summary */}
              <motion.p
                variants={staggerItem}
                className="text-white/65 text-sm leading-relaxed"
              >
                {news.summary}
              </motion.p>

              {/* Source */}
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 10h16M4 14h10M4 18h8" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Source</p>
                  <p className="text-white/70 text-xs font-medium truncate">{news.source}</p>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div variants={staggerItem}>
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${CATEGORY_COLORS[news.category]}22, ${CATEGORY_COLORS[news.category]}0a)`,
                    border: `1px solid ${CATEGORY_COLORS[news.category]}35`,
                    color: CATEGORY_COLORS[news.category],
                  }}
                >
                  <span>Read Full Article</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
