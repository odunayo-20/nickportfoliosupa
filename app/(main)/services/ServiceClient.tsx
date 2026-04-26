"use client";
import { Smartphone, Globe, Database, Cpu, Check, ArrowRight } from 'lucide-react'
import { motion, Variants } from 'motion/react'
import Link from 'next/link';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const ServiceClient = () => {
  return (
    <>

    <motion.header 
        className="bg-brand-green text-white pt-24 pb-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center reveal">
            <motion.div variants={fadeInUp}>
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-6">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Expertise
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
                    Engineering <br/> <span className="text-brand-orange italic font-normal">solutions</span> for scale.
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                    I bridge the gap between complex business requirements and flawless technical execution. From native mobile apps to robust enterprise backends.
                </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="hidden md:block relative">
                <div className="absolute inset-0 bg-brand-orange/10 rounded-full blur-3xl"></div>
                <div className="relative grid grid-cols-2 gap-4 opacity-80">
                    <div className="h-32 border border-white/20 rounded-sharp flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-sm">
                        <Smartphone className="w-8 h-8 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Native</span>
                    </div>
                    <div className="h-32 border border-white/20 rounded-sharp flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-sm translate-y-8">
                        <Globe className="w-8 h-8 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Web</span>
                    </div>
                    <div className="h-32 border border-white/20 rounded-sharp flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-sm -translate-y-8">
                        <Database className="w-8 h-8 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Data</span>
                    </div>
                    <div className="h-32 border border-white/20 rounded-sharp flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-sm">
                        <Cpu className="w-8 h-8 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Logic</span>
                    </div>
                </div>
            </motion.div>
        </div>
    </motion.header>

    <motion.section 
        className="py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <div className="border-t border-gray-200">
                
                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">01</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Multiplatform App Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin Multiplatform</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Compose Multiplatform</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">SQLDelight</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Ship one codebase to Android and iOS while sharing up to 70% of code — without sacrificing native performance. I architect KMP apps from scratch including offline-first storage, real-time WebSocket systems, and cloud backend (Supabase/PostgreSQL).
                        </p>
                        <p className="text-brand-dark font-bold text-sm mb-4 italic">
                            Proven by: TraderApp (trading simulator), Up Network (social/events app)
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> ~70% shared Kotlin code between Android & iOS</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Offline-first with SQLDelight caching</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time Supabase Realtime + WebSocket integration</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Full backend design (PostgreSQL, RLS, Edge Functions, RPCs)</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">02</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Native Mobile Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Jetpack Compose</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Android SDK</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Java</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Native Android applications with hardware-level performance — real-time streaming, geo-spatial maps, ARCore, and sensor integrations. Focused on high-performance media pipelines and deep device capabilities.
                        </p>
                        <p className="text-brand-dark font-bold text-sm mb-4 italic">
                            Experience: Meritum Soft (10+ fan apps for premier football clubs)
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> RTMP Streaming & Media Pipelines</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> ARCore & MapLibre Clustering</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> STOMP/WebSocket Real-time Events</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Geofencing & Sensor Integrations</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">03</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Web App & Dashboard Development</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">PostgreSQL</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">TypeScript</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Edge Functions</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Backend-first web applications and admin dashboards powered by Supabase. I build data-intensive tools featuring real-time synchronization, PostGIS spatial queries, and automated background jobs.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time Data Dashboards</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> PostGIS Spatial Queries</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Automated Scheduled Jobs (pg_cron)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Secure RLS & Role-based Access</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">04</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Technical Consulting</h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Architecture</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">KMP Migration</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Supabase Design</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Strategic guidance for high-growth startups and enterprises. I help teams navigate complex architectural transitions, optimize database performance, and implement robust real-time systems.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> KMP Architecture Planning (Native to KMP)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Supabase Backend Design & RLS Review</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Performance Optimization (API & Caching)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time System Design (WebSockets)</li>
                        </ul>
                    </div>
                </motion.div>

            </div>
        </div>
    </motion.section>

    <motion.section 
        className="py-32 bg-brand-offwhite"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 reveal">
            <motion.div variants={fadeInUp} className="text-center mb-20">
                <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-4">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> Methodology
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark">How We Work Together</h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">1</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Strategic Discovery</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Deep-dive into your business logic and platform requirements (Android, iOS, Web) to identify shared logic opportunities and long-term scaling goals.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">2</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Unified Architecture</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Designing the shared Kotlin core, Supabase database schema, and offline-first storage strategy to ensure consistency across all devices.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">3</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Agile Execution</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Sprint-based development with ~70% code sharing. Code is modular, typesafe, and continuously tested against edge cases for maximum reliability.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">4</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Continuous Delivery</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Zero-downtime deployment to App Stores and cloud servers, coupled with real-time performance monitoring and automated edge functions.</p>
                </motion.div>
            </div>
        </div>
    </motion.section>

    <motion.section 
        className="py-24 bg-brand-light border-b border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto px-6 text-center reveal">
            <h2 className="text-4xl font-extrabold tracking-tighter text-brand-dark mb-6">Ready to scale your product?</h2>
            <p className="text-brand-muted text-lg mb-10">Whether you need a full app built from scratch or high-level consulting to fix a bottleneck, let's talk.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="contact" className="px-8 py-4 bg-brand-orange text-brand-dark font-bold rounded-full hover:bg-brand-dark hover:text-white transition-all shadow-lg flex items-center gap-2">
                    Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="projects" className="px-8 py-4 border border-gray-300 text-brand-dark font-bold rounded-full hover:border-brand-dark transition-all">
                    View Case Studies
                </Link>
            </div>
        </motion.div>
    </motion.section>
    
    </>
  )
}

export default ServiceClient