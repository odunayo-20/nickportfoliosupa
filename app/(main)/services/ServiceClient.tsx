"use client";
import { Check, ArrowRight } from 'lucide-react'
import { SystemDiagram } from '@/components/services/SystemDiagram'
import { m } from 'motion/react'
import { SplitText } from '@/components/motion/SplitText'
import { StackCards } from '@/components/motion/StackCards'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import Link from 'next/link';



const ServiceClient = () => {
  return (
    <>

    <m.header 
        className="bg-brand-green text-white pt-24 pb-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <m.div variants={fadeInUp}>
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-6">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Expertise
                </span>
                <SplitText as="h1" immediate delay={0.15} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
                    Engineering <br/> <span className="text-brand-orange italic font-normal">solutions</span> for scale.
                </SplitText>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                    I bridge the gap between complex business requirements and flawless technical execution. From native mobile apps to robust enterprise backends.
                </p>
            </m.div>
            <m.div variants={fadeInUp} className="hidden md:block relative">
                {/* Architecture map: Multiplatform core wired to the four disciplines */}
                <SystemDiagram />
            </m.div>
        </div>
    </m.header>

    <m.section 
        className="py-24 bg-surface"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
 {/* S1: service cards pin and stack like a deck */}
            <StackCards gap="gap-8">
                
                <m.div variants={fadeInUp} className="bg-surface border border-line rounded-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] py-10 md:py-14 px-6 md:px-10 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">01</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-ink mb-4">Multiplatform App Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin Multiplatform</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Compose Multiplatform</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">SQLDelight</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-ink-muted text-lg leading-relaxed mb-6">
                            Ship one codebase to Android and iOS while sharing up to 70% of code — without sacrificing native performance. I architect KMP apps from scratch including offline-first storage, real-time WebSocket systems, and cloud backend (Supabase/PostgreSQL).
                        </p>
                        <p className="text-ink font-bold text-sm mb-4 italic">
                            Proven by: TraderApp (trading simulator), Up Network (social/events app)
                        </p>
                        <ul className="space-y-3 text-ink font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> ~70% shared Kotlin code between Android & iOS</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Offline-first with SQLDelight caching</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time Supabase Realtime + WebSocket integration</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Full backend design (PostgreSQL, RLS, Edge Functions, RPCs)</li>
                        </ul>
                    </div>
                </m.div>

                <m.div variants={fadeInUp} className="bg-surface border border-line rounded-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] py-10 md:py-14 px-6 md:px-10 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">02</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-ink mb-4">Native Mobile Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Jetpack Compose</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Android SDK</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Java</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-ink-muted text-lg leading-relaxed mb-6">
                            Native Android applications with hardware-level performance — real-time streaming, geo-spatial maps, ARCore, and sensor integrations. Focused on high-performance media pipelines and deep device capabilities.
                        </p>
                        <p className="text-ink font-bold text-sm mb-4 italic">
                            Experience: Meritum Soft (10+ fan apps for premier football clubs)
                        </p>
                        <ul className="space-y-3 text-ink font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> RTMP Streaming & Media Pipelines</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> ARCore & MapLibre Clustering</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> STOMP/WebSocket Real-time Events</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Geofencing & Sensor Integrations</li>
                        </ul>
                    </div>
                </m.div>

                <m.div variants={fadeInUp} className="bg-surface border border-line rounded-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] py-10 md:py-14 px-6 md:px-10 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">03</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-ink mb-4">Web App & Dashboard Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">PostgreSQL</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">TypeScript</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Edge Functions</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-ink-muted text-lg leading-relaxed mb-6">
                            Backend-first web applications and admin dashboards powered by Supabase. I build data-intensive tools featuring real-time synchronization, PostGIS spatial queries, and automated background jobs.
                        </p>
                        <ul className="space-y-3 text-ink font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time Data Dashboards</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> PostGIS Spatial Queries</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Automated Scheduled Jobs (pg_cron)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Secure RLS & Role-based Access</li>
                        </ul>
                    </div>
                </m.div>

                <m.div variants={fadeInUp} className="bg-surface border border-line rounded-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] py-10 md:py-14 px-6 md:px-10 grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">04</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-ink mb-4">Technical Consulting</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Architecture</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">KMP Migration</span>
                            <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase Design</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-ink-muted text-lg leading-relaxed mb-6">
                            Strategic guidance for high-growth startups and enterprises. I help teams navigate complex architectural transitions, optimize database performance, and implement robust real-time systems.
                        </p>
                        <ul className="space-y-3 text-ink font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> KMP Architecture Planning (Native to KMP)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Supabase Backend Design & RLS Review</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Performance Optimization (API & Caching)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time System Design (WebSockets)</li>
                        </ul>
                    </div>
                </m.div>

            </StackCards>
        </div>
    </m.section>

    <m.section 
        className="py-32 bg-surface-alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <m.div variants={fadeInUp} className="text-center mb-20">
                <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-4">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> Methodology
                </span>
                <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink">How We Work Together</SplitText>
            </m.div>

            <div className="grid md:grid-cols-4 gap-8">
                <m.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-2"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">1</div>
                    
                    <h3 className="text-xl font-bold text-ink mt-6 mb-3">Strategic Discovery</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">Deep-dive into your business logic and platform requirements (Android, iOS, Web) to identify shared logic opportunities and long-term scaling goals.</p>
                </m.div>

                <m.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-2"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">2</div>
                    
                    <h3 className="text-xl font-bold text-ink mt-6 mb-3">Unified Architecture</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">Designing the shared Kotlin core, Supabase database schema, and offline-first storage strategy to ensure consistency across all devices.</p>
                </m.div>

                <m.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-2"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">3</div>
                    
                    <h3 className="text-xl font-bold text-ink mt-6 mb-3">Agile Execution</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">Sprint-based development with ~70% code sharing. Code is modular, typesafe, and continuously tested against edge cases for maximum reliability.</p>
                </m.div>

                <m.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-2 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">4</div>
                    
                    <h3 className="text-xl font-bold text-ink mt-6 mb-3">Continuous Delivery</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">Zero-downtime deployment to App Stores and cloud servers, coupled with real-time performance monitoring and automated edge functions.</p>
                </m.div>
            </div>
        </div>
    </m.section>

    <m.section 
        className="py-24 bg-surface border-b border-line"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <m.div variants={fadeInUp} className="max-w-4xl mx-auto px-6 text-center">
            <SplitText className="text-4xl font-extrabold tracking-tighter text-ink mb-6">Ready to scale your product?</SplitText>
            <p className="text-ink-muted text-lg mb-10">Whether you need a full app built from scratch or high-level consulting to fix a bottleneck, let&apos;s talk.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="contact" className="btn-fill px-8 py-4 bg-brand-orange text-brand-dark font-bold rounded-full transition-colors duration-300 shadow-lg flex items-center gap-2 [--fill:var(--ink)] [--fill-ink:var(--surface)]">
                    Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="projects" className="btn-fill px-8 py-4 border border-line text-ink font-bold rounded-full hover:border-ink transition-colors duration-300 [--fill:var(--ink)] [--fill-ink:var(--surface)]">
                    View Case Studies
                </Link>
            </div>
        </m.div>
    </m.section>
    
    </>
  )
}

export default ServiceClient