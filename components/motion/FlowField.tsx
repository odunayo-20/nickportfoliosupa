'use client'

import { useEffect, useRef } from 'react'
import { fitCanvas, isDarkTheme, onThemeChange, prefersReducedMotion, visibleLoop } from './canvas'

const PALETTES = {
  light: ['rgba(255,184,0,.7)', 'rgba(42,71,54,.4)', 'rgba(42,71,54,.22)', 'rgba(255,184,0,.38)'],
  dark: ['rgba(255,184,0,.55)', 'rgba(140,197,162,.42)', 'rgba(238,242,239,.2)', 'rgba(255,184,0,.3)'],
}

/** Radius (px) around the pointer inside which particles turn toward it. */
const POINTER_RADIUS = 170
/** How far the noise field may bend a particle off its course to the target (< 1 = always progresses toward it). */
const WANDER = 0.85

type Props = {
  className?: string
  /** Canvas pixels per particle: higher = fewer particles. */
  density?: number
  max?: number
  /** 'dark' = always use the dark-background palette (e.g. inside the footer). */
  tone?: 'auto' | 'dark'
  /**
   * CSS selector of an element the particles stream toward (e.g. a CTA button). They still
   * meander with the noise field, but always make progress toward it and vanish into it.
   * Without a target, particles just drift with the field.
   */
  target?: string
}

/**
 * Strands drifting through a slow noise field. Particles close to the mouse head for it;
 * with a `target`, everything else streams toward that element.
 * Fills its positioned parent. Decorative: aria-hidden, never blocks pointer events — the pointer
 * is tracked on window, because the content layered above the canvas would otherwise swallow it.
 */
export function FlowField({ className = '', density = 140, max = 900, tone = 'auto', target }: Props) {
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
    // Pointer in viewport coordinates; converted to canvas space each frame so scrolling
    // (with a stationary mouse) keeps working.
    const ptr = { cx: 0, cy: 0, on: false }
    const tgt = { x: 0, y: 0, r: 0, on: false }
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
    const spawn = (p = {} as P) => {
      Object.assign(p, { x: rand() * w, y: rand() * h, life: 80 + rand() * 260, v: 0.5 + rand(), c: colors[(rand() * colors.length) | 0] })
      // Don't respawn on top of the target: it would be swallowed immediately.
      for (let i = 0; tgt.on && i < 4 && (p.x - tgt.x) ** 2 + (p.y - tgt.y) ** 2 < (tgt.r * 3) ** 2; i++) {
        p.x = rand() * w; p.y = rand() * h
      }
      return p
    }

    // Re-read where the target and pointer sit relative to the canvas (both move: the
    // button is magnetic, the page scrolls).
    const locate = () => {
      const r = cv.getBoundingClientRect()
      const el = target ? document.querySelector(target) : null
      if (el) {
        const b = el.getBoundingClientRect()
        tgt.on = b.width > 0
        tgt.x = b.left + b.width / 2 - r.left
        tgt.y = b.top + b.height / 2 - r.top
        tgt.r = Math.max(14, Math.min(b.width, b.height) / 2)
      } else tgt.on = false
      return r
    }

    const setup = () => {
      ;({ ctx, w, h } = fitCanvas(cv))
      ctx.lineWidth = 1.1
      ctx.lineCap = 'round'
      locate()
      parts = Array.from({ length: Math.min(window.innerWidth < 768 ? Math.min(max, 320) : max, Math.round((w * h) / density)) }, () => spawn())
    }

    const R2 = POINTER_RADIUS * POINTER_RADIUS
    const step = () => {
      const r = locate()
      const px = ptr.cx - r.left, py = ptr.cy - r.top
      const usePtr = ptr.on && px > -POINTER_RADIUS && py > -POINTER_RADIUS && px < w + POINTER_RADIUS && py < h + POINTER_RADIUS

      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,.05)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      for (const p of parts) {
        const a = angle(p.x, p.y)
        let dx = Math.cos(a), dy = Math.sin(a), speed = p.v * 1.6

        if (tgt.on) {
          // Heading = unit vector to the target + a smaller noise vector: the path curves and
          // weaves, but the net motion always points at the target.
          const tx = tgt.x - p.x, ty = tgt.y - p.y, td = Math.hypot(tx, ty) || 1
          if (td < tgt.r) { spawn(p); continue }
          dx = tx / td + dx * WANDER
          dy = ty / td + dy * WANDER
        }

        if (usePtr) {
          const mx = px - p.x, my = py - p.y, d2 = mx * mx + my * my
          if (d2 < R2) {
            const md = Math.sqrt(d2)
            if (md < 6) { spawn(p); continue }
            // Blend toward the pointer; the pull is strongest right next to it.
            const k = (1 - d2 / R2) ** 0.6
            const n = Math.hypot(dx, dy) || 1
            dx = (dx / n) * (1 - k) + (mx / md) * k
            dy = (dy / n) * (1 - k) + (my / md) * k
            speed *= 1 + k * 0.8
          }
        }

        const n = Math.hypot(dx, dy) || 1
        const nx = p.x + (dx / n) * speed, ny = p.y + (dy / n) * speed
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
      ptr.on = false
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
    if (reduce) {
      // Fonts/layout can move the target after first paint: redraw the still once settled.
      const settle = window.setTimeout(still, 600)
      still()
      return () => { clearTimeout(settle); ro.disconnect(); offTheme() }
    }

    for (let i = 0; i < 60; i++) step()
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      ptr.cx = e.clientX; ptr.cy = e.clientY; ptr.on = true
    }
    const leave = () => { ptr.on = false }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    const stop = visibleLoop(host, step)
    return () => {
      stop(); ro.disconnect(); offTheme()
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [density, max, tone, target])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />
}
