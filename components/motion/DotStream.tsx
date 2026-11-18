'use client'

import { useEffect, useRef } from 'react'
import { fitCanvas, onThemeChange, prefersReducedMotion, visibleLoop } from './canvas'

/**
 * Proposal H2 — rows of dots rippling like a signal; they part around the pointer.
 * Renders its own block (default 120px tall). Colour follows --color-brand-orange.
 */
export function DotStream({ className = 'h-28', rows = 6 }: { className?: string; rows?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current!
    const cv = host.querySelector('canvas')!
    const reduce = prefersReducedMotion()
    let ctx: CanvasRenderingContext2D, w = 0, h = 0
    let hover = 0, near = 0
    const start = performance.now()
    const ptr = { x: -999, y: -999 }
    let color = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-orange').trim() || '#ffb800'

    const draw = (now: number) => {
      const s = (now - start) / 1000
      const inside = ptr.x > -999
      hover += ((inside ? 1 : 0) - hover) * 0.08
      near += ((inside ? 1 : 0) - near) * 0.1
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      for (let r = 0; r < rows; r++) {
        const y0 = (h * (r + 0.8)) / (rows + 0.6)
        ctx.globalAlpha = (0.2 + 0.3 * hover) * (r % 2 ? 0.65 : 1)
        for (let x = ((s * (14 + 18 * hover) + r * 5) % 11) - 11; x < w + 11; x += 11) {
          let y = y0 + Math.sin(x * 0.02 + s * 0.7 + r) * 4
          const dx = x - ptr.x, dy = y0 - ptr.y
          y += Math.sign(dy || 1) * 26 * near * Math.exp(-(dx * dx + dy * dy) / 2400)
          ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 6.283); ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }
    const setup = () => ({ ctx, w, h } = fitCanvas(cv))

    setup()
    const ro = new ResizeObserver(() => { setup(); draw(performance.now()) })
    ro.observe(host)
    const offTheme = onThemeChange(() => {
      color = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-orange').trim() || color
      draw(performance.now())
    })
    if (reduce) { draw(start); return () => { ro.disconnect(); offTheme() } }

    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top }
    const leave = () => { ptr.x = ptr.y = -999 }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    const stop = visibleLoop(host, draw)
    return () => { stop(); ro.disconnect(); offTheme(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [rows])

  return (
    <div ref={ref} aria-hidden="true" className={`relative w-full overflow-hidden ${className}`}>
      <canvas className="absolute inset-0 w-full h-full" />
    </div>
  )
}
