'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useSpring, useTransform } from 'motion/react'
import workspace from '@/public/about/workspace.webp'
import { ClipReveal } from '@/components/motion/ClipReveal'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

/**
 * Hotspots on the workspace photo. x/y are percentages of the photo (it is shown at its own
 * 4:3 ratio, so they stay on target at any size). Edit the text freely.
 */
const HOTSPOTS = [
  { x: 36.5, y: 27, title: 'Main screen', text: 'Android Studio: the shared Kotlin Multiplatform module, written once for Android and iOS.' },
  { x: 68, y: 27, title: 'Emulator', text: 'Every change is checked on a running device, not just in the IDE.' },
  { x: 49, y: 50, title: 'Keyboard', text: 'RGB mechanical keyboard: prompting Claude Code and reviewing every change before it ships.' },
  { x: 75, y: 76, title: 'Workstation', text: 'Windows tower for Android builds, emulators and backend work.' },
  { x: 93, y: 58, title: 'Mac mini', text: 'Xcode and iOS builds for the multiplatform apps.' },
]

/**
 * About "My Journey" visual: the photo, the orange offset block and a blue LED glow move at
 * different depths with the cursor; pulsing hotspots open short notes about the setup.
 */
export function WorkspaceShowcase() {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  const px = useMotionValue(0), py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 })
  // Depth layers: glow furthest back (moves most, opposite way), photo in front.
  const glowX = useTransform(sx, (v) => v * -40), glowY = useTransform(sy, (v) => v * -40)
  const blockX = useTransform(sx, (v) => v * -22), blockY = useTransform(sy, (v) => v * -22)
  const photoX = useTransform(sx, (v) => v * 14), photoY = useTransform(sy, (v) => v * 14)

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !root.current) return
    const r = root.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { px.set(0); py.set(0); setOpen(null) }

  // Close an open hotspot on Escape or a tap elsewhere.
  useEffect(() => {
    if (open === null) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    const tap = (e: PointerEvent) => { if (!(e.target as Element).closest?.('[data-hotspot]')) setOpen(null) }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', tap)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', tap) }
  }, [open])

  return (
    <div ref={root} className="relative isolate" onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* Blue LED glow, matched to the desk's backlight */}
      <m.div aria-hidden="true" style={{ x: glowX, y: glowY }} className="absolute -inset-6 -z-20">
        <div className={`w-full h-full rounded-[40%] bg-[radial-gradient(ellipse_at_60%_55%,rgba(64,110,255,.55),rgba(64,110,255,0)_70%)] blur-2xl ${reduce ? 'opacity-60' : 'animate-[led-breathe_5s_ease-in-out_infinite]'}`} />
      </m.div>

      {/* Orange offset block */}
      <m.div aria-hidden="true" style={{ x: blockX, y: blockY }} className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-brand-orange -translate-x-4 translate-y-4 rounded-sharp" />
      </m.div>

      {/* Photo + hotspots */}
      <m.div style={{ x: photoX, y: photoY }}>
        <ClipReveal delay={0.3} className="rounded-sharp border-4 border-brand-green overflow-hidden">
          <div className="relative">
            <Image
              src={workspace}
              alt="My workspace: three monitors with code and an Android emulator, an RGB mechanical keyboard, a desktop PC and a Mac mini, lit by a blue LED strip"
              placeholder="blur"
              preload
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              className="w-full h-auto aspect-[4/3] object-cover"
            />
            {HOTSPOTS.map((h, i) => {
              const isOpen = open === i
              // Keep tooltips inside the photo: anchor to the side away from the nearest edge.
              const align = h.x > 70 ? 'right-0' : h.x < 30 ? 'left-0' : 'left-1/2 -translate-x-1/2'
              const below = h.y < 35 // near the top: open downward so the photo edge doesn't clip it
              return (
                <div
                  key={h.title}
                  data-hotspot
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%`, zIndex: isOpen ? 20 : 10 }}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(i) }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen((o) => (o === i ? null : o)) }}
                >
                  <button
                    type="button"
                    aria-label={`${h.title}: ${h.text}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    onFocus={() => setOpen(i)}
                    onBlur={() => setOpen((o) => (o === i ? null : o))}
                    className="relative grid place-items-center w-7 h-7 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {!reduce && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-brand-orange animate-[hotspot-ping_2.4s_ease-out_infinite]" style={{ animationDelay: `${i * 0.4}s` }} />}
                    <span aria-hidden="true" className={`relative w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,184,0,.9)] transition-[background-color,scale] duration-200 ${isOpen ? 'bg-white scale-125' : 'bg-brand-orange'}`} />
                  </button>
                  <div
                    role="tooltip"
                    aria-hidden={!isOpen}
                    className={`absolute ${align} ${below ? 'top-full mt-2' : 'bottom-full mb-2'} w-56 rounded-xl bg-brand-dark/90 backdrop-blur-md border border-white/15 px-4 py-3 text-left shadow-2xl pointer-events-none transition-[opacity,translate] duration-200 ${
                      isOpen ? 'opacity-100 translate-y-0' : `opacity-0 ${below ? '-translate-y-1' : 'translate-y-1'}`
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-brand-orange mb-1">{h.title}</span>
                    <span className="block text-sm leading-snug text-white/90">{h.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </ClipReveal>
      </m.div>

      <p className="mt-6 text-xs text-white/50 hidden sm:block" aria-hidden="true">Hover the dots to explore the setup.</p>
    </div>
  )
}
