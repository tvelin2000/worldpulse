import type { Variants } from 'framer-motion'

// Panel slide-in from right
export const panelVariants: Variants = {
  hidden: {
    x: 60,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
    },
  },
  exit: {
    x: 40,
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: [0.55, 0.055, 0.675, 0.19], // easeInCubic
    },
  },
}

// Overlay fade
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// Tooltip fade-up
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.97,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
}

// Header fade-down on mount
export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
  },
}

// Stagger container for panel content
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// GSAP ease strings
export const GSAP_EASES = {
  smooth: 'power3.inOut',
  snappy: 'power2.out',
  bounce: 'back.out(1.4)',
}
