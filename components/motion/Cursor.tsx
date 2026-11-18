'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Proposal I2 — dot + trailing ring. The ring grows over links/buttons and becomes a labelled
 * disc over elements with `data-cursor="View"` (project cards, blog cards, gallery images).
 * Only for fine pointers with motion allowed; the native cursor stays visible except over
 * labelled media, so nothing is lost if this fails.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const d = dot.current!, r = ring.current!
    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, visible = false
    const root = document.documentElement

    const loop = () => {
      rx += (tx - rx) * 0.2
      ry += (ty - ry) * 0.2
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.1 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX; ty = e.clientY
      d.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      if (!visible) { visible = true; rx = tx; ry = ty; root.dataset.cursor = 'on' }
      if (!raf) raf = requestAnimationFrame(loop)

      const t = e.target as Element
      const media = t.closest?.('[data-cursor]') as HTMLElement | null
      const interactive = !media && t.closest?.('a, button, [role="button"], input, textarea, select, label')
      r.dataset.state = media ? 'media' : interactive ? 'link' : ''
      setLabel(media?.dataset.cursor ?? '')
    }
    const leave = () => { visible = false; delete root.dataset.cursor }
    const down = () => r.dataset.pressed = '1'
    const up = () => delete r.dataset.pressed

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      delete root.dataset.cursor
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div aria-hidden="true" className="site-cursor">
      <div ref={ring} className="site-cursor-ring"><span>{label}</span></div>
      <div ref={dot} className="site-cursor-dot" />
    </div>
  )
}
