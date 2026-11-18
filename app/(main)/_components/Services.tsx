"use client"

import { ArrowRight, ArrowUpRight, Smartphone, Cpu, Globe } from 'lucide-react'
import { m } from 'motion/react'
import Link from 'next/link'
import { SplitText } from '@/components/motion/SplitText'
import { TiltCard } from '@/components/motion/TiltCard'
import { fadeInUp, staggerContainer, VIEWPORT } from '@/lib/motion'

const SERVICES = [
    {
        n: '01',
        icon: Smartphone,
        title: 'Multiplatform Apps',
        text: 'Building high-performance Android and iOS apps from a single Kotlin codebase, sharing up to 70% of shared logic.',
        tags: ['Kotlin Multiplatform', 'Compose', 'SwiftUI interop'],
    },
    {
        n: '02',
        icon: Cpu,
        title: 'Native Android',
        text: 'Hardware-level performance with real-time streaming, ARCore, and deep sensor integrations.',
    },
    {
        n: '03',
        icon: Globe,
        title: 'Web Dashboards',
        text: 'Backend-first admin panels powered by Supabase, PostGIS, and real-time data visualization.',
    },
]

const Services = () => {
    const [hero, ...rest] = SERVICES
    const HeroIcon = hero.icon

    return (
        <m.section
            id="services"
            className="max-w-7xl mx-auto px-6 py-24"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={staggerContainer}
        >
            <m.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                        <span className="w-4 h-[2px] bg-brand-orange"></span> Services
                    </span>
                    <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink">Services I Provide</SplitText>
                </div>
                <Link href="/services" className="btn-fill group px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-full flex items-center gap-3 transition-colors duration-300">
                    View All Services
                    <span className="w-6 h-6 bg-surface rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-3 h-3 text-accent-green" />
                    </span>
                </Link>
            </m.div>

            {/* Bento: one large feature card + two stacked cards */}
            <div className="glow-group grid md:grid-cols-3 md:grid-rows-2 gap-6 [perspective:1400px]">
                <TiltCard
                    variants={fadeInUp}
                    max={4}
                    spotlight="rgba(255, 184, 0, 0.18)"
                    className="glow-card md:col-span-2 md:row-span-2 rounded-sharp bg-brand-green text-white overflow-hidden hover:shadow-2xl transition-motion-safe duration-300"
                >
                    <Link href="/services" className="group relative flex flex-col h-full min-h-[340px] p-8 md:p-12">
                        <span aria-hidden="true" className="absolute -right-4 -top-10 text-[11rem] md:text-[16rem] font-black leading-none text-white/5 select-none transition-transform duration-700 group-hover:-translate-x-4">
                            {hero.n}
                        </span>
                        <div className="w-14 h-14 bg-brand-orange rounded-md flex items-center justify-center mb-auto shadow-lg transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                            <HeroIcon className="w-7 h-7 text-brand-dark" />
                        </div>
                        <div className="relative mt-16">
                            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{hero.title}</h3>
                            <p className="text-gray-300 max-w-md mb-6 leading-relaxed">{hero.text}</p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {hero.tags?.map(t => (
                                    <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/20">{t}</span>
                                ))}
                            </div>
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange">
                                Learn more
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                        </div>
                    </Link>
                </TiltCard>

                {rest.map(({ n, icon: Icon, title, text }) => (
                    <TiltCard
                        key={title}
                        variants={fadeInUp}
                        max={6}
                        className="glow-card rounded-sharp bg-surface-alt border border-transparent hover:border-brand-orange/20 hover:shadow-xl transition-motion-safe duration-300"
                    >
                        <Link href="/services" className="group relative flex flex-col h-full p-8">
                            <span aria-hidden="true" className="absolute right-6 top-5 text-5xl font-black text-ink/5 select-none">{n}</span>
                            <div className="w-12 h-12 bg-surface rounded-md flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                                <Icon className="w-6 h-6 text-accent-green" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-ink">{title}</h3>
                            <p className="text-ink-muted text-sm mb-6 leading-relaxed">{text}</p>
                            <span className="mt-auto text-sm font-semibold text-brand-orange flex items-center gap-2 transition-[gap] duration-300 group-hover:gap-3">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </TiltCard>
                ))}
            </div>
        </m.section>
    )
}

export default Services
