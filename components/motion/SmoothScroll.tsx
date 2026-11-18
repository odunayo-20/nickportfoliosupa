'use client'

import 'lenis/dist/lenis.css'
import { useEffect, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { ReactLenis, useLenis } from 'lenis/react'

// Lenis only smooths wheel/trackpad input. On touch-primary devices it would just listen to
// native scroll, force layout reads and toggle classes on <html> (measurable jank on phones),
// so it isn't mounted there — nor for visitors who prefer reduced motion.
const OFF_QUERY = '(prefers-reduced-motion: reduce), (hover: none) and (pointer: coarse)'
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(OFF_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const useLenisEnabled = () =>
  useSyncExternalStore(subscribe, () => !window.matchMedia(OFF_QUERY).matches, () => false)

/**
 * Lenis smooth scrolling for the public site (mouse/trackpad devices).
 * - Root mode: the instance lives in lenis/react's global store, so `useLenis()` works anywhere
 *   and mounting/unmounting it never remounts the page tree.
 * - Elements inside [role="dialog"] or [data-lenis-prevent] scroll natively.
 * - In-page #anchor links scroll smoothly and stop below the sticky navbar.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const enabled = useLenisEnabled()

  return (
    <>
      {enabled && (
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            wheelMultiplier: 1,
            anchors: { offset: -88 },
            stopInertiaOnNavigate: true,
            prevent: (node) => !!node.closest?.('[role="dialog"], [data-lenis-prevent]'),
          }}
        />
      )}
      {enabled && <ResetOnNavigate />}
      {children}
    </>
  )
}

/** Next scrolls to the top on navigation; make sure Lenis' internal target agrees. */
function ResetOnNavigate() {
  const pathname = usePathname()
  const lenis = useLenis()
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname, lenis])
  return null
}

/**
 * Locks page scrolling while `active` (modals, drawers, lightboxes).
 * Stops Lenis when present and falls back to overflow:hidden for native scrolling.
 */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!active) return
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      html.style.overflow = prev
    }
  }, [active, lenis])
}
