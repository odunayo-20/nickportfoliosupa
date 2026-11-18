'use client'

import { useEffect } from 'react'

/**
 * One delegated listener for two CSS-driven pointer effects:
 *  - `.btn-fill` (proposal I1): sets --x/--y to where the pointer entered/left so the fill
 *    circle grows from that point.
 *  - `.glow-group` (proposal C2): sets --mx/--my on every `.glow-card` inside the group, so
 *    the border light follows the pointer across neighbouring cards.
 * Mouse/pen only; touch devices just get the hover colour.
 */
export function PointerEffects() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const setFill = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.('.btn-fill') as HTMLElement | null
      if (!btn) return
      const r = btn.getBoundingClientRect()
      btn.style.setProperty('--x', `${e.clientX - r.left}px`)
      btn.style.setProperty('--y', `${e.clientY - r.top}px`)
    }

    let raf = 0
    let last: PointerEvent | null = null
    const glow = () => {
      raf = 0
      const e = last
      if (!e) return
      const group = (e.target as Element | null)?.closest?.('.glow-group')
      if (!group) return
      group.querySelectorAll<HTMLElement>('.glow-card').forEach((c) => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--mx', `${e.clientX - r.left}px`)
        c.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    const move = (e: PointerEvent) => { last = e; if (!raf) raf = requestAnimationFrame(glow) }
    const out = (e: PointerEvent) => {
      const from = (e.target as Element | null)?.closest?.('.glow-group')
      const to = (e.relatedTarget as Element | null)?.closest?.('.glow-group')
      if (from && from !== to) from.querySelectorAll<HTMLElement>('.glow-card').forEach((c) => { c.style.setProperty('--mx', '-999px'); c.style.setProperty('--my', '-999px') })
    }

    document.addEventListener('pointerover', setFill)
    document.addEventListener('pointerout', setFill)
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', out)
    return () => {
      document.removeEventListener('pointerover', setFill)
      document.removeEventListener('pointerout', setFill)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', out)
      cancelAnimationFrame(raf)
    }
  }, [])
  return null
}
