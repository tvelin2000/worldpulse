'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { overlayVariants } from '@/lib/animations'
import { useGlobeStore } from '@/store/globeStore'

export function Overlay() {
  const isPanelOpen = useGlobeStore((s) => s.isPanelOpen)
  const closePanel  = useGlobeStore((s) => s.closePanel)

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px]"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  )
}
