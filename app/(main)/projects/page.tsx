import { ArrowRight, Database, Fingerprint, Plus } from 'lucide-react'
import Link from 'next/link'

const Project = () => {
  return (
    <>
    <header className="bg-brand-offwhite pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Selected Works
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6">
                Building <span className="text-brand-orange italic font-normal">digital products</span><br/> that scale.
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                A collection of high-performance mobile applications, enterprise architectures, and robust web systems I've engineered over the past 8 years.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
                <button className="px-6 py-2 bg-brand-dark text-white text-sm font-bold rounded-full shadow-md">All Projects</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">Mobile Apps</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">Web Systems</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">UI/UX Design</button>
            </div>
        </div>
    </header>

    <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 reveal">
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow project-card">
                <div className="overflow-hidden bg-brand-offwhite h-full min-h-[400px] relative">
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200" 
                         alt="UP Social App Dashboard" 
                         className="project-image absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-10 lg:p-16">
                    <div className="flex gap-2 mb-6">
                        <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                        <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-3 py-1 rounded-full uppercase tracking-widest">Mobile App</span>
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-brand-dark mb-6">UP Social Event Platform</h2>
                    <p className="text-brand-muted leading-relaxed mb-8">
                        A high-concurrency social media application engineered for discovering, creating, and managing local events seamlessly. Architected the real-time notification engine and scalable state management to handle thousands of simultaneous active users with zero latency.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-10 border-l-2 border-brand-orange pl-4">
                        <span className="text-sm font-semibold text-brand-dark">React Native</span>
                        <span className="text-sm text-brand-muted">•</span>
                        <span className="text-sm font-semibold text-brand-dark">Node.js</span>
                        <span className="text-sm text-brand-muted">•</span>
                        <span className="text-sm font-semibold text-brand-dark">AWS Architecture</span>
                    </div>

                    <a href="#" className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-dark transition-colors">
                        View Case Study <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3 text-brand-green" /></div>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section className="py-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10">
                
                <div className="project-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow reveal">
                    <div className="aspect-[4/3] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000" 
                             alt="DitDash Utility App" 
                             className="project-image absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <span className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">Utility & Low-Level API</span>
                        <h3 className="text-2xl font-bold text-brand-dark mb-4">DitDash Engine</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-8 flex-grow">
                            A specialized Morse code communication tool. Developed highly optimized Kotlin translation algorithms allowing for real-time, hardware-level execution with extreme battery efficiency.
                        </p>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <div className="flex gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" className="w-4 h-4 grayscale"/></span>
                                <span className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" className="w-4 h-4 grayscale"/></span>
                            </div>
                            <a href="#" className="text-sm font-bold text-brand-green flex items-center gap-2 hover:text-brand-orange transition-colors">
                                View Details <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="project-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow reveal">
                    <div className="aspect-[4/3] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                             alt="OdunGlobal Enterprise" 
                             className="project-image absolute inset-0 w-full h-full object-cover grayscale" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <span className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">Enterprise Web System</span>
                        <h3 className="text-2xl font-bold text-brand-dark mb-4">OdunGlobal Dashboard</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-8 flex-grow">
                            Designed and engineered a massive internal tracking dashboard for a global logistics client. Focused heavily on complex data visualization and micro-frontend architecture.
                        </p>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <div className="flex gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="w-4 h-4 grayscale"/></span>
                                <span className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center"><Database className="w-4 h-4 text-gray-500" /></span>
                            </div>
                            <a href="#" className="text-sm font-bold text-brand-green flex items-center gap-2 hover:text-brand-orange transition-colors">
                                View Details <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="project-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow reveal">
                    <div className="aspect-[4/3] overflow-hidden relative bg-brand-offwhite">
                        <div className="absolute inset-0 bg-brand-green/90 flex items-center justify-center project-image">
                            <Fingerprint className="w-24 h-24 text-brand-orange opacity-50" />
                        </div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <span className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">Security Architecture</span>
                        <h3 className="text-2xl font-bold text-brand-dark mb-4">AuthCore System</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-8 flex-grow">
                            A highly secure, decoupled authentication microservice built for banking platforms. Implemented strict OAuth2 protocols, biometric bridging, and zero-trust data flows.
                        </p>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Next.js</span>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">PostgreSQL</span>
                            </div>
                            <a href="#" className="text-sm font-bold text-brand-green flex items-center gap-2 hover:text-brand-orange transition-colors">
                                View Details <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-brand-offwhite border-2 border-dashed border-gray-300 rounded-sharp overflow-hidden hover:border-brand-orange transition-colors reveal items-center justify-center text-center p-12 h-full min-h-[400px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Plus className="w-8 h-8 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Your Project Here</h3>
                    <p className="text-brand-muted text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                        Currently accepting new freelance opportunities and full-time senior engineering roles. Let's build something phenomenal.
                    </p>
                    <Link href="/contact" className="px-8 py-3 bg-brand-dark text-white font-bold rounded-full hover:bg-brand-orange transition-colors">
                        Start a Conversation
                    </Link>
                </div>

            </div>
        </div>
    </section>

    
    </>
  )
}

export default Project