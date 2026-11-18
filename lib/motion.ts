import type { Transition, Variants } from 'motion/react'

/**
 * Shared animation primitives for the public site.
 * Import from here instead of redefining variants per component.
 */

// ── Easing & timing ──────────────────────────────────────────────
export const EASE_OUT = [0.22, 1, 0.36, 1] as const      // smooth "expo-ish" out
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.8,
} as const

export const spring: Transition = { type: 'spring', stiffness: 300, damping: 24 }
export const softSpring: Transition = { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }

/** Default viewport for whileInView reveals. */
export const VIEWPORT = { once: true, margin: '-100px' } as const

// ── Entrance variants (use with initial="hidden" + animate/whileInView="visible") ──
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
}

/** Pops in with a spring overshoot — good for badges, chips, icons. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: spring },
}

/** Masked text reveal: wrap the m.span in an `overflow-hidden` inline-block parent. */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: EASE_OUT } },
}

// ── Containers ───────────────────────────────────────────────────
export const stagger = (staggerChildren = 0.15, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren, delayChildren } },
})

/** fadeInUp that also staggers its own children (e.g. a card whose chips pop in after it). */
export const fadeInUpStagger = (staggerChildren = 0.05, delayChildren = 0.2): Variants => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT, staggerChildren, delayChildren },
  },
})

export const staggerContainer = stagger(0.15)
export const staggerContainerFast = stagger(0.12)

// ── Hover / tap presets (spread onto m.* elements) ──────────────
export const hoverLift = {
  whileHover: { y: -6, transition: spring },
  whileTap: { scale: 0.98 },
} as const

export const hoverScale = {
  whileHover: { scale: 1.04, transition: spring },
  whileTap: { scale: 0.96 },
} as const

// ── View Transition names (shared elements across routes) ───────
/** Card image on /projects morphs into the hero image on /projects/[slug]. */
export const projectImageTransitionName = (slug: string) => `project-image-${slug}`
