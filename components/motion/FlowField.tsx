'use client'

import { useEffect, useRef } from 'react'
import { fitCanvas, isDarkTheme, onThemeChange, prefersReducedMotion, visibleLoop } from './canvas'

const PALETTES = {
  light: ['rgba(255,184,0,.7)', 'rgba(42,71,54,.4)', 'rgba(42,71,54,.22)', 'rgba(255,184,0,.38)'],
  dark: ['rgba(255,184,0,.55)', 'rgba(140,197,162,.42)', 'rgba(238,242,239,.2)', 'rgba(255,184,0,.3)'],
}

/**
 * Proposal H1 — strands drifting through a slow noise field; the pointer bends the current.
 * Fills its positioned parent. Decorative: aria-hidden, pointer events come from the parent.
 */
export function FlowField({ className = '', density = 140, max = 900, tone = 'auto' }: { className?: string; density?: number; max?: number; /** 'dark' = always use the dark-background palette (e.g. inside the footer) */ tone?: 'auto' | 'dark' }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const host = cv.parentElement!
    const reduce = prefersReducedMotion()
    let ctx: CanvasRenderingContext2D, w = 0, h = 0, t = 0
    const pick = () => PALETTES[tone === 'dark' || isDarkTheme() ? 'dark' : 'light']
    let colors = pick()
    type P = { x: number; y: number; life: number; v: number; c: string }
    let parts: P[] = []
    const ptr = { x: -9999, y: -9999 }
    // Seedable random: the reduced-motion still image must look identical after every redraw
    // (mobile address-bar resizes, theme switches) instead of jumping to a new random pattern.
    let rand = Math.random
    const seeded = (seed: number) => () => {
      seed = (seed + 0x6d2b79f5) | 0
      let x = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296
    }

    const angle = (x: number, y: number) =>
      Math.sin(x * 0.0042 + t * 0.00012) * 1.3 + Math.cos(y * 0.006 - t * 0.00016) * 1.3 + Math.sin((x + y) * 0.003 + t * 0.0001) * 0.8
    const spawn = (p = {} as P) =>
      Object.assign(p, { x: rand() * w, y: rand() * h, life: 50 + rand() * 200, v: 0.5 + rand(), c: colors[(rand() * colors.length) | 0] })
    const setup = () => {
      ;({ ctx, w, h } = fitCanvas(cv))
      ctx.lineWidth = 1.1
      ctx.lineCap = 'round'
      parts = Array.from({ length: Math.min(window.innerWidth < 768 ? Math.min(max, 320) : max, Math.round((w * h) / density)) }, () => spawn())
    }
    const step = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,.05)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      for (const p of parts) {
        let a = angle(p.x, p.y)
        const dx = p.x - ptr.x, dy = p.y - ptr.y, d = dx * dx + dy * dy
        if (d < 9000) a += (1 - d / 9000) * 1.8 * Math.sign(dx * Math.sin(a) - dy * Math.cos(a) || 1)
        const nx = p.x + Math.cos(a) * p.v * 1.6, ny = p.y + Math.sin(a) * p.v * 1.6
        ctx.strokeStyle = p.c
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke()
        p.x = nx; p.y = ny
        if (--p.life < 0 || nx < -5 || nx > w + 5 || ny < -5 || ny > h + 5) spawn(p)
      }
      t += 16
    }
    const still = () => {
      rand = seeded(7)
      t = 0
      parts = parts.map(() => spawn())
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < 160; i++) step()
      rand = Math.random
    }

    setup()
    const ro = new ResizeObserver(() => { setup(); if (reduce) still() })
    ro.observe(host)
    const offTheme = onThemeChange(() => {
      colors = pick()
      parts.forEach((p) => (p.c = colors[(Math.random() * colors.length) | 0]))
      ctx.clearRect(0, 0, w, h)
      if (reduce) still()
    })
    if (reduce) { still(); return () => { ro.disconnect(); offTheme() } }

    for (let i = 0; i < 60; i++) step()
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = cv.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top
    }
    const leave = () => { ptr.x = ptr.y = -9999 }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    const stop = visibleLoop(host, step)
    return () => { stop(); ro.disconnect(); offTheme(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [density, max, tone])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />
}
