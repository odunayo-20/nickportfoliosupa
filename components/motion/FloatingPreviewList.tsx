'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export type PreviewItem = { href: string; title: string; meta?: string; tags?: string[]; image?: string | null }

/**
 * Proposal I3 — index-style list; hovering a row shows its cover beside the pointer, tilting
 * with movement and sliding between covers row to row. Touch devices see a plain list with a
 * small thumbnail per row instead.
 */
export function FloatingPreviewList({ items }: { items: PreviewItem[] }) {
  const host = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const h = host.current, pv = preview.current
    if (!h || !pv || !window.matchMedia('(pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tx = 0, ty = 0, x = 0, y = 0, rot = 0, raf = 0
    const loop = () => {
      const vx = tx - x
      x += vx * 0.14; y += (ty - y) * 0.14
      rot += ((reduce ? 0 : Math.max(-10, Math.min(10, vx * 0.2))) - rot) * 0.15
      pv.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`
      raf = Math.abs(vx) + Math.abs(ty - y) + Math.abs(rot) > 0.1 ? requestAnimationFrame(loop) : 0
    }
    const move = (e: PointerEvent) => {
      const r = h.getBoundingClientRect()
      tx = Math.min(e.clientX - r.left + 24, r.width - 300)
      ty = e.clientY - r.top - 110
      if (!raf) raf = requestAnimationFrame(loop)
    }
    h.addEventListener('pointermove', move)
    return () => { h.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={host} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {items.map((it, i) => (
          <li key={it.href}>
            <Link
              href={it.href}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              data-cursor="View"
              className="group relative z-10 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_auto] items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-line transition-[padding,color] duration-500 hover:md:pl-6 hover:text-brand-orange"
            >
              <span className="md:hidden relative w-16 h-12 rounded-md overflow-hidden bg-surface-alt shrink-0">
                {it.image && <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />}
              </span>
              <span className="min-w-0">
                <span className="block text-2xl md:text-4xl font-extrabold tracking-tight text-ink group-hover:text-brand-orange transition-colors">{it.title}</span>
                {it.tags && it.tags.length > 0 && (
                  <span className="hidden md:block mt-2 text-sm text-muted truncate">{it.tags.join(' · ')}</span>
                )}
              </span>
              {it.meta && <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-muted">{it.meta}</span>}
              <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-brand-orange group-hover:rotate-45 transition-[color,rotate] duration-300" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating cover (desktop pointer only) */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`hidden md:block pointer-events-none absolute left-0 top-0 z-0 w-[280px] h-[200px] rounded-xl overflow-hidden shadow-2xl transition-[opacity,scale] duration-300 ${active === null ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
      >
        <div
          className="absolute inset-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ transform: `translateY(-${(active ?? 0) * 100}%)` }}
        >
          {items.map((it) => (
            <div key={it.href} className="relative shrink-0 w-full h-full bg-surface-alt">
              {it.image && <Image src={it.image} alt="" fill sizes="280px" className="object-cover" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
