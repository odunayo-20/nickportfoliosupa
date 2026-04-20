"use client";
import { Smartphone, Globe, Database, Cpu, Check, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link';

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

const Service = () => {
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
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Native Mobile Development</h2>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Java</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Android SDK</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Building hardware-accelerated, zero-latency mobile applications. I specialize in deep device API integration, memory-safe architecture via Coroutines, and offline-first data caching to ensure your app runs flawlessly in any condition.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Complex State Management</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Real-time WebSocket Integration</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Hardware/Sensor Optimization</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">02</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Scalable Web Architecture</h2>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Next.js</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Node.js</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">PostgreSQL</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Designing the digital backbone that powers modern applications. From decoupling monolithic systems into microservices to engineering secure authentication gateways and high-concurrency event platforms.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> API Design (REST & GraphQL)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Cloud Infrastructure (AWS/GCP)</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> High-Concurrency Database Tuning</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">03</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">UI/UX Implementation</h2>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Figma Integration</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">TailwindCSS</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            A great design is useless if the code doesn't respect it. I act as the ultimate bridge between your design team and the codebase, ensuring micro-interactions, responsive grids, and typography are translated with pixel-perfect accuracy.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Design System Tokenization</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Fluid Animation Engineering</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Strict Accessibility (a11y) Compliance</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="service-row border-b border-l-4 border-l-transparent border-b-gray-200 py-16 px-4 md:px-8 grid md:grid-cols-12 gap-8 items-start reveal">
                    <div className="md:col-span-1 text-2xl font-black text-brand-orange italic opacity-50">04</div>
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Technical Consulting</h2>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Auditing</span>
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">System Design</span>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            Is your current application buckling under user load? I provide retained consulting to audit existing codebases, identify memory leaks, restructure monolithic repositories, and mentor junior development teams.
                        </p>
                        <ul className="space-y-3 text-brand-dark font-medium">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Codebase Audits & Refactoring</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> CI/CD Pipeline Setup</li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-brand-orange" /> Tech Stack Migration Planning</li>
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
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Discovery</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Deep-dive into your business logic, user demographics, and long-term scaling goals before a single line of code is written.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">2</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Architecture</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Designing the database schema, selecting the strict technology stack, and setting up the CI/CD deployment pipelines.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">3</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Execution</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Agile, sprint-based development. Code is heavily documented, modular, and tested continuously against edge cases.</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-brand-orange"></div>
                    <div className="absolute -top-3 left-0 w-6 h-6 bg-brand-orange text-brand-dark font-black flex items-center justify-center rounded-full text-xs">4</div>
                    
                    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-3">Deployment</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Zero-downtime deployment to app stores and cloud servers, followed by performance monitoring and strict QA handoff.</p>
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

export default Service