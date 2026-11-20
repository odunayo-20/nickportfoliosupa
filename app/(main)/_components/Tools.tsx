"use client"

import { m } from 'motion/react'
import { SplitText } from '@/components/motion/SplitText'
import { fadeInUp, staggerContainer, VIEWPORT } from '@/lib/motion'

const LAYERS = [
    { layer: 'UI', tools: ['Compose Multiplatform', 'Jetpack Compose'], note: 'Screens written once, native on Android and iOS.' },
    { layer: 'Shared logic', tools: ['Kotlin Multiplatform', 'Coroutines & Flow'], note: 'Clean Architecture, so business rules never touch the platform.' },
    { layer: 'Local data', tools: ['SQLDelight'], note: 'Offline-first. The app works on a plane and syncs later.' },
    { layer: 'Network', tools: ['Ktor'], note: 'One HTTP client shared by both platforms.' },
    { layer: 'Backend', tools: ['Supabase', 'Firebase'], note: 'PostgreSQL, Edge Functions and Realtime, without running servers.' },
    { layer: 'Tooling', tools: ['Android Studio', 'Xcode', 'Git'], note: 'Java where an older module still needs it.' },
]

const Tools = () => {
    return (
        <m.section
            id="tools"
            className="py-24"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={staggerContainer}
        >
            <div className="max-w-7xl mx-auto px-6">
                <m.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> How I Build
                </m.span>
                <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink mb-12">
                    One Kotlin Codebase,<br />Top to Bottom
                </SplitText>

                <dl className="border-t border-line">
                    {LAYERS.map(({ layer, tools, note }) => (
                        <m.div
                            key={layer}
                            variants={fadeInUp}
                            className="grid grid-cols-1 md:grid-cols-[11rem_minmax(0,1.2fr)_minmax(0,1fr)] gap-x-8 gap-y-1 py-5 border-b border-line md:items-baseline"
                        >
                            <dt className="font-mono text-xs uppercase tracking-widest text-ink-muted">{layer}</dt>
                            <dd className="text-xl font-extrabold tracking-tight text-ink leading-snug">
                                {tools.map((tool, i) => (
                                    <span key={tool}>
                                        {i > 0 && <span className="text-brand-orange px-2" aria-hidden="true">/</span>}
                                        {tool}
                                    </span>
                                ))}
                            </dd>
                            <dd className="text-[15px] text-ink-soft">{note}</dd>
                        </m.div>
                    ))}
                </dl>
            </div>
        </m.section>
    )
}

export default Tools
