import { Calendar, ArrowRight, MailOpen } from 'lucide-react'

const Blog = () => {
  return (
    <>
    
        <header className="bg-brand-offwhite pt-24 pb-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> My Technical Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6">
                Thoughts on <span className="text-brand-orange italic font-normal">architecture</span><br/> & clean code.
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                A collection of articles detailing my experiences with Java, Kotlin, React Native, and the realities of scaling systems for enterprise clients.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
                <button className="px-6 py-2 bg-brand-dark text-white text-sm font-bold rounded-full shadow-md">All Posts</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">Architecture</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">Kotlin</button>
                <button className="px-6 py-2 bg-white text-brand-muted border border-gray-200 text-sm font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors">Mobile Dev</button>
            </div>
        </div>
    </header>

    <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 reveal">
            <h2 className="text-2xl font-extrabold tracking-tighter text-brand-dark mb-10 border-b border-gray-200 pb-4">Featured Article</h2>
            
            <a href="#" className="group grid lg:grid-cols-2 gap-10 items-center bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all article-card">
                <div className="overflow-hidden bg-brand-offwhite h-full min-h-[350px] relative">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" 
                         alt="Coding Screen" 
                         className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                </div>
                <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Architecture</span>
                        <span className="text-sm font-medium text-brand-muted flex items-center gap-1"><Calendar className="w-4 h-4" /> April 12, 2026</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark mb-6 group-hover:text-brand-green transition-colors">
                        The Case for Pure Kotlin in Enterprise Scale Applications.
                    </h3>
                    <p className="text-brand-muted text-lg leading-relaxed mb-8">
                        Why cross-platform frameworks are still struggling to match native performance when memory management, threading, and hardware-level APIs become critical to business operations.
                    </p>
                    <div className="inline-flex items-center gap-2 text-brand-green font-bold group-hover:gap-4 transition-all">
                        Read Full Article <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </a>
        </div>
    </section>

    <section className="pb-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold tracking-tighter text-brand-dark mb-10 border-b border-gray-200 pb-4">Latest Posts</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <a href="#" className="article-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all reveal group">
                    <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                             alt="Data" 
                             className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Mobile Dev</span>
                            <span className="text-xs font-medium text-brand-muted">March 28, 2026</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">State Management in Large React Native Projects</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">
                            Lessons learned from building UP Social. How to keep your global state from becoming a bottleneck when handling massive concurrency.
                        </p>
                        <div className="text-sm font-bold text-brand-orange flex items-center gap-2">
                            Read More <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </a>

                <a href="#" className="article-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all reveal group delay-100">
                    <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=800" 
                             alt="Code" 
                             className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                            <span className="text-xs font-medium text-brand-muted">Feb 14, 2026</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">Mastering Coroutines for Zero-Latency Apps</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">
                            A deep dive into structuring threading architectures. How we ensured real-time translation for the DitDash engine without UI freezes.
                        </p>
                        <div className="text-sm font-bold text-brand-orange flex items-center gap-2">
                            Read More <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </a>

                <a href="#" className="article-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all reveal group delay-200">
                    <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" 
                             alt="Laptop" 
                             className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Databases</span>
                            <span className="text-xs font-medium text-brand-muted">Jan 05, 2026</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">Building Offline-First Apps with WatermelonDB</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">
                            Why optimistic UI is the future of mobile applications, and how caching layers prevent uninstalls in low-connectivity areas.
                        </p>
                        <div className="text-sm font-bold text-brand-orange flex items-center gap-2">
                            Read More <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </a>

            </div>
            
            <div className="mt-16 text-center reveal">
                <button className="px-8 py-3 bg-brand-offwhite border border-gray-200 text-brand-dark font-bold rounded-full hover:bg-brand-green hover:text-white hover:border-brand-green transition-all shadow-sm">
                    Load More Articles
                </button>
            </div>
        </div>
    </section>

    <section className="py-24 bg-brand-green text-white">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <MailOpen className="w-12 h-12 text-brand-orange mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6">Stay in the Loop</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                Join 2,500+ other developers receiving my monthly insights on software architecture, Kotlin patterns, and scaling mobile apps.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input type="email" placeholder="Enter your email address" required 
                       className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" />
                <button type="submit" className="px-8 py-4 bg-brand-orange text-brand-dark font-bold rounded-full hover:bg-white transition-colors whitespace-nowrap shadow-lg">
                    Subscribe Now
                </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe at any time.</p>
        </div>
    </section>

    
    </>
  )
}

export default Blog