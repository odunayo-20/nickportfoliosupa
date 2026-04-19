"use client";
import { ArrowLeft, ExternalLink, Layers, Zap, Database, Check, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const ProjectDetails = () => {
  return (
    <>
    <motion.header 
        className="pt-20 pb-16 bg-brand-light"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 reveal">
            <a href="projects.html" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </a>
            
            <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
                <div className="lg:col-span-8">
                    <div className="flex gap-3 mb-6">
                        <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Case Study</span>
                        <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-3 py-1 rounded-full uppercase tracking-widest">Mobile App</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark leading-[1.05]">
                        UP Social Event Platform.
                    </h1>
                </div>
                <div className="lg:col-span-4 pb-2">
                    <p className="text-brand-muted text-lg leading-relaxed">
                        A high-concurrency social media application engineered for discovering, creating, and managing local events seamlessly.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-200 border mb-16">
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Role</span>
                    <span className="font-semibold text-brand-dark">Lead Mobile Engineer</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Timeline</span>
                    <span className="font-semibold text-brand-dark">8 Months (2023)</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Platform</span>
                    <span className="font-semibold text-brand-dark">iOS & Android</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Live App</span>
                    <a href="#" className="font-semibold text-brand-orange flex items-center gap-1 hover:gap-2 transition-all">
                        View on Store <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-brand-offwhite rounded-sharp overflow-hidden relative border border-gray-100">
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000" 
                     alt="UP Social App Interface" 
                     className="w-full h-full object-cover" />
            </div>
        </motion.div>
    </motion.header>

    <motion.section 
        className="py-24 bg-brand-offwhite"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16">
                <motion.div variants={fadeInUp} className="lg:col-span-4 reveal">
                    <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-4">The Challenge</h2>
                    <div className="w-12 h-1 bg-brand-orange"></div>
                </motion.div>
                <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-6 reveal text-lg text-brand-muted leading-relaxed">
                    <p>
                        UP was conceptualized as a hyper-local event discovery platform. The core business requirement was real-time accuracy: users needed to see events populating on a live map, RSVP instantly, and receive push notifications without any perceived delay.
                    </p>
                    <p>
                        The existing MVP, built by an external agency, was buckling under the weight of just 5,000 active users. State management was chaotic, resulting in ghost notifications, UI freezes during heavy map panning, and a battery drain issue that was leading to rapid uninstalls.
                    </p>
                    <p className="font-semibold text-brand-dark">
                        My mandate was clear: rebuild the mobile architecture from the ground up to handle 100,000 concurrent users while maintaining a silky 60fps scrolling experience.
                    </p>
                </motion.div>
            </div>
        </div>
    </motion.section>

    <motion.section 
        className="py-32 bg-brand-green text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20 reveal">
                <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-4">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> Architecture
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">The Engineering Solution</h2>
                <p className="text-gray-300 text-lg">We moved away from a monolithic state tree and implemented a reactive, event-driven architecture using React Native and native Kotlin/Swift bridges for heavy lifting.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-10 rounded-sharp hover:bg-white/10 transition-colors reveal">
                    <Layers className="w-8 h-8 text-brand-orange mb-6" />
                    <h3 className="text-xl font-bold mb-4">Decoupled State</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Replaced Redux with a highly granular Zustand store, preventing unnecessary re-renders during rapid map movements and live-feed updates.</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-10 rounded-sharp hover:bg-white/10 transition-colors reveal">
                    <Zap className="w-8 h-8 text-brand-orange mb-6" />
                    <h3 className="text-xl font-bold mb-4">Native WebSockets</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Built custom Kotlin/Swift modules for the WebSocket connection, offloading socket parsing from the JS thread to guarantee 0ms perceived UI latency.</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-10 rounded-sharp hover:bg-white/10 transition-colors reveal">
                    <Database className="w-8 h-8 text-brand-orange mb-6" />
                    <h3 className="text-xl font-bold mb-4">Optimistic UI</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Engineered an offline-first caching layer using WatermelonDB. RSVPs and event creations appear instant to the user, syncing silently in the background.</p>
                </motion.div>
            </div>
        </div>
    </motion.section>

    <motion.section 
        className="py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 reveal">
                <div className="aspect-square bg-brand-offwhite rounded-sharp overflow-hidden border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Data Visualization" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="aspect-square bg-brand-offwhite rounded-sharp overflow-hidden border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=1000" alt="App Development" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
            </motion.div>
        </div>
    </motion.section>

    <motion.section 
        className="py-24 bg-brand-offwhite border-y border-gray-200 border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={fadeInUp} className="reveal">
                    <h2 className="text-4xl font-extrabold tracking-tighter text-brand-dark mb-6">The Impact</h2>
                    <p className="text-brand-muted text-lg leading-relaxed mb-8">
                        Post-launch, the architecture proved its resilience. During the Halloween weekend peak, the platform handled a 5x surge in concurrent users without a single dropped socket connection or memory spike.
                    </p>
                    <ul className="space-y-4 text-brand-dark font-medium">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green"><Check className="w-4 h-4" /></div>
                            Maintained 60fps rendering across 95% of devices.
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green"><Check className="w-4 h-4" /></div>
                            Reduced battery consumption footprint by 45%.
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green"><Check className="w-4 h-4" /></div>
                            Zero-downtime deployments enabled for the backend team.
                        </li>
                    </ul>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8 reveal">
                    <div className="bg-white p-8 rounded-sharp border border-gray-100 shadow-sm text-center">
                        <div className="text-5xl font-extrabold text-brand-orange mb-2 italic">200%</div>
                        <div className="text-sm font-bold text-brand-dark uppercase tracking-widest">Increase in DAU</div>
                    </div>
                    <div className="bg-white p-8 rounded-sharp border border-gray-100 shadow-sm text-center">
                        <div className="text-5xl font-extrabold text-brand-orange mb-2 italic">99.9%</div>
                        <div className="text-sm font-bold text-brand-dark uppercase tracking-widest">Crash-Free Rate</div>
                    </div>
                    <div className="bg-white p-8 rounded-sharp border border-gray-100 shadow-sm text-center col-span-2">
                        <div className="text-5xl font-extrabold text-brand-orange mb-2 italic">&lt; 50ms</div>
                        <div className="text-sm font-bold text-brand-dark uppercase tracking-widest">Map Render Latency</div>
                    </div>
                </motion.div>
            </div>
        </div>
    </motion.section>

    <motion.section 
        className="py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 text-center reveal">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 block">Up Next</span>
            <a href="#" className="group inline-block">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6 group-hover:text-brand-orange transition-colors">
                    DitDash Engine
                </h2>
                <div className="flex items-center justify-center gap-2 text-brand-green font-bold group-hover:gap-4 transition-all">
                    View Case Study <ArrowRight className="w-5 h-5" />
                </div>
            </a>
        </motion.div>
    </motion.section>

    </>
  )
}

export default ProjectDetails