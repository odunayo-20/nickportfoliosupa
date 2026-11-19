'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import { m } from 'motion/react'
import { Smartphone, Globe, Database, Cpu, Layers } from 'lucide-react'
import { visibleLoop } from '@/components/motion/canvas'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

/**
 * Services hero visual: an architecture map. Multiplatform sits at the core, wired to the four
 * disciplines; orange data packets travel along the wires, and hovering a node lights its wire.
 *
 * Everything is laid out in one 500×400 coordinate space (the box keeps that aspect ratio), so
 * the SVG wires and the HTML nodes line up at any width without measuring.
 */
const W = 500, H = 400
const CORE = { x: 250, y: 200 }

type Node = { key: string; label: string; x: number; y: number; Icon: ComponentType<{ className?: string }> }
const NODES: Node[] = [
  { key: 'native', label: 'Native', x: 88, y: 78, Icon: Smartphone },
  { key: 'web', label: 'Web', x: 412, y: 78, Icon: Globe },
  { key: 'data', label: 'Data', x: 88, y: 322, Icon: Database },
  { key: 'logic', label: 'Logic', x: 412, y: 322, Icon: Cpu },
]

// S-curve from the core out to a node.
const wire = ({ x, y }: Node) => {
  const mx = (CORE.x + x) / 2
  return `M${CORE.x},${CORE.y} C${mx},${CORE.y} ${mx},${y} ${x},${y}`
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`

export function SystemDiagram() {
  const box = useRef<HTMLDivElement>(null)
  const paths = useRef<(SVGPathElement | null)[]>([])
  const dots = useRef<(SVGCircleElement | null)[]>([])
  const hotRef = useRef<string | null>(null)
  const [hot, setHot] = useState<string | null>(null)
  const reduce = useHydratedReducedMotion()

  useEffect(() => { hotRef.current = hot }, [hot])

  // Two packets per wire: one heading out from the core, one coming back in.
  useEffect(() => {
    const el = box.current
    if (!el) return
    const packets = NODES.flatMap((n, i) => [0, 1].map((j) => ({
      wire: i, key: n.key, out: j === 0, t: (i * 0.23 + j * 0.5) % 1, speed: 0.0035 + ((i + j) % 3) * 0.0012,
    })))
    const lengths = paths.current.map((p) => p?.getTotalLength() ?? 0)
    const place = () => packets.forEach((k, i) => {
      const p = paths.current[k.wire], c = dots.current[i]
      if (!p || !c) return
      const pt = p.getPointAtLength((k.out ? k.t : 1 - k.t) * lengths[k.wire])
      c.setAttribute('cx', String(pt.x))
      c.setAttribute('cy', String(pt.y))
      // Fade in/out at the ends so packets don't pop.
      c.style.opacity = String(Math.min(1, k.t * 6, (1 - k.t) * 6) * (hotRef.current && hotRef.current !== k.key ? 0.35 : 1))
    })
    place()
    if (reduce) return
    return visibleLoop(el, () => {
      for (const k of packets) k.t = (k.t + k.speed * (hotRef.current === k.key ? 2.2 : 1)) % 1
      place()
    })
  }, [reduce])

  return (
    <div
      ref={box}
      className="relative w-full max-w-[560px] mx-auto"
      style={{ aspectRatio: `${W} / ${H}` }}
      onPointerLeave={() => setHot(null)}
    >
      {/* soft glow behind the core */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 w-2/3 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/15 blur-3xl" />

      <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <filter id="pkt-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {NODES.map((n, i) => (
          <g key={n.key}>
            {/* faint dashed track */}
            <path d={wire(n)} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={6} strokeLinecap="round" />
            <m.path
              ref={(el: SVGPathElement | null) => { paths.current[i] = el }}
              d={wire(n)}
              fill="none"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="transition-[stroke] duration-300"
              stroke={hot === n.key ? 'var(--color-brand-orange)' : 'rgba(255,255,255,.22)'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        ))}
        {NODES.flatMap((n, i) => [0, 1].map((j) => (
          <circle
            key={`${n.key}-${j}`}
            ref={(el) => { dots.current[i * 2 + j] = el }}
            r={j === 0 ? 3.5 : 2.5}
            fill="var(--color-brand-orange)"
            filter="url(#pkt-glow)"
            style={{ opacity: 0 }}
          />
        )))}
      </svg>

      {/* Core */}
      <m.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct(CORE.x, W), top: pct(CORE.y, H), width: '30%' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-square rounded-full border-2 border-brand-orange bg-brand-green/80 backdrop-blur-sm shadow-[0_0_40px_-6px_var(--color-brand-orange)] flex flex-col items-center justify-center gap-2">
          {!reduce && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-brand-orange/60 animate-[core-pulse_2.8s_ease-out_infinite]" />}
          <Layers className="w-9 h-9 text-brand-orange" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">Multiplatform</span>
        </div>
      </m.div>

      {/* Satellite nodes */}
      {NODES.map((n, i) => (
        <m.div
          key={n.key}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(n.x, W), top: pct(n.y, H), width: '24%' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          onPointerEnter={() => setHot(n.key)}
        >
          <div
            className={`aspect-square rounded-sharp border bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-[border-color,background-color,translate,box-shadow] duration-300 ${
              hot === n.key ? 'border-brand-orange bg-white/10 -translate-y-1 shadow-[0_12px_30px_-12px_var(--color-brand-orange)]' : 'border-white/20'
            }`}
          >
            <n.Icon className="w-8 h-8 text-brand-orange" />
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${hot === n.key ? 'text-white' : 'text-white/60'}`}>{n.label}</span>
          </div>
        </m.div>
      ))}
    </div>
  )
}
