'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HorizontalPin } from '@/components/motion/HorizontalPin'
import { SplitText } from '@/components/motion/SplitText'

export type FeaturedProject = { slug: string; title: string; category: string | null; image: string | null; tech: string[] }

/** Phase 4 "featured work on home" using proposal S2 (pinned horizontal gallery). */
export default function FeaturedWork({ projects }: { projects: FeaturedProject[] }) {
  if (!projects.length) return null

  const header = (
    <div className="max-w-7xl w-full mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
          <span className="w-4 h-[2px] bg-brand-orange" /> Selected work
        </span>
        <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink">
          Things I&apos;ve <span className="text-brand-orange italic font-normal">shipped</span>
        </SplitText>
      </div>
      <Link href="/projects" className="btn-fill group self-start md:self-auto px-6 py-2.5 border border-line text-ink text-sm font-semibold rounded-full flex items-center gap-3 [--fill:var(--ink)] [--fill-ink:var(--surface)] transition-colors duration-300">
        All projects
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  )

  return (
    <section aria-label="Selected work" className="bg-surface py-16 lg:py-0">
      <HorizontalPin header={header}>
        {/* Leading spacer aligns the first card with the page container on wide screens */}
        <div aria-hidden="true" className="hidden lg:block shrink-0 w-[max(0px,calc((100vw-80rem)/2))]" />
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-cursor="View"
            className="group snap-start shrink-0 w-[80vw] sm:w-[420px] lg:w-[520px] first:ml-0"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-alt">
              {p.image ? (
                <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 520px, 80vw" className="object-cover transition-[scale,filter] duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0" />
              ) : (
                <div className="absolute inset-0 bg-brand-green/20" />
              )}
              <span className="absolute left-4 top-4 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-surface/90 text-ink backdrop-blur">
                {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-ink group-hover:text-brand-orange transition-colors">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-muted truncate">{[p.category, ...p.tech.slice(0, 3)].filter(Boolean).join(' · ')}</p>
              </div>
              <ArrowUpRight className="w-6 h-6 shrink-0 text-ink-muted group-hover:text-brand-orange group-hover:rotate-45 transition-[color,rotate] duration-300" />
            </div>
          </Link>
        ))}
        <div aria-hidden="true" className="hidden lg:block shrink-0 w-24" />
      </HorizontalPin>
    </section>
  )
}
