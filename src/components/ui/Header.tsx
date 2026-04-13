'use client'

import { motion } from 'framer-motion'
import { headerVariants } from '@/lib/animations'

export function Header() {
  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 pointer-events-none"
    >
      {/* Logo + wordmark */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
          {/* Globe SVG icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/90">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.5 7.5H19.5M4.5 16.5H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm tracking-tight leading-none">
            WorldPulse
          </h1>
          <p className="text-white/40 text-xs mt-0.5 leading-none">
            Live Global Intelligence
          </p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm pointer-events-auto">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-white/60 text-xs font-medium">Live</span>
        <span className="text-white/30 text-xs">· 15 events today</span>
      </div>
    </motion.header>
  )
}
