import { ArrowLeft, Clock, Calendar, Copy, Link, ArrowRight, MailOpen } from 'lucide-react'

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12.5 3 11c-1.2.6-2.5.5-3.5-.5 1-1.3 2.8-1.5 4-1.5-1-1.5-1.5-3.5-.5-5 1.5 2 3.5 3.5 6 4-.5-3.5 4-5.5 6.5-3 1.5-.5 3-1.5 4-2.5-1 1.5-2.5 3-4 3.5z"></path>
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12.5 3 11c-1.2.6-2.5.5-3.5-.5 1-1.3 2.8-1.5 4-1.5-1-1.5-1.5-3.5-.5-5 1.5 2 3.5 3.5 6 4-.5-3.5 4-5.5 6.5-3 1.5-.5 3-1.5 4-2.5-1 1.5-2.5 3-4 3.5z"></path>
  </svg>
)

const BlogView = () => {
  return (
    <>
    <header className="pt-20 pb-12 bg-brand-light">
        <div className="max-w-4xl mx-auto px-6 reveal">
            <a href="blog.html" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Journal
            </a>
            
            <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Architecture</span>
                <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-3 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                <span className="text-sm font-medium text-brand-muted flex items-center gap-1 ml-auto"><Clock className="w-4 h-4" /> 8 min read</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-brand-dark leading-[1.1] mb-8">
                The Case for Pure Kotlin in Enterprise Scale Applications.
            </h1>
            
            <div className="flex items-center justify-between py-6 border-y border-gray-100 border">
                <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=150" alt="Nikola" className="w-12 h-12 rounded-full object-cover border-2 border-brand-green/10" />
                    <div>
                        <div className="font-bold text-brand-dark">Nikola</div>
                        <div className="text-sm text-brand-muted">Senior App Developer</div>
                    </div>
                </div>
                <div className="text-sm font-medium text-brand-muted flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Published April 12, 2026
                </div>
            </div>
        </div>
    </header>

    <div className="max-w-6xl mx-auto px-6 mb-16 reveal">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-brand-offwhite rounded-sharp overflow-hidden border border-gray-100">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000" 
                 alt="Coding Screen Architecture" 
                 className="w-full h-full object-cover grayscale" />
        </div>
    </div>

    <article className="max-w-3xl mx-auto px-6 pb-20 reveal article-body">
        <p className="text-xl font-medium text-brand-dark leading-relaxed mb-10">
            In the last few years, the push for cross-platform frameworks like React Native and Flutter has been deafening. The pitch is undeniably attractive: write your code once, deploy it everywhere, and cut your engineering costs in half. But what happens when you scale beyond a standard CRUD app?
        </p>

        <p>
            When I was brought in to rebuild the architecture for the UP Social Event Platform, the original MVP was built on a popular cross-platform tool. It worked perfectly for the first 5,000 users. But as concurrency grew, the bridge between the JavaScript thread and the native UI thread became a massive bottleneck. Map panning stuttered, background synchronization drained batteries, and state management felt like untangling Christmas lights.
        </p>

        <h2>The Reality of Hardware-Level Constraints</h2>
        <p>
            Enterprise applications are rarely just fetching JSON from an API and displaying it in a list. They require fine-grained control over memory allocation, multi-threading, and hardware sensors. This is where <span className="inline-code">Kotlin</span> shines.
        </p>
        <p>
            By shifting to a pure Kotlin architecture on the Android side, we bypassed the bridge overhead entirely. Let's look at how we handled complex background tasks.
        </p>

        <blockquote>
            "Performance is not a feature you bolt on at the end of development. It is the architectural foundation upon which the application is built."
        </blockquote>

        <h2>Coroutines: The Game Changer</h2>
        <p>
            One of the most significant advantages of Kotlin in an enterprise environment is its approach to asynchronous programming. Callbacks lead to "callback hell," and standard threads are too heavy to spin up by the thousands. Kotlin Coroutines provide a lightweight, highly readable solution.
        </p>

        <p>Here is a simplified snippet of how we managed real-time event polling without blocking the Main (UI) thread:</p>

        {/* <div className="relative group">
            <button className="absolute top-4 right-4 bg-[#21262d] text-gray-400 hover:text-white px-3 py-1 rounded text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Copy className="w-3 h-3" /> Copy
            </button>

        </div> */}

        <p>
            Notice the use of <span className="inline-code">withContext(Dispatchers.IO)</span>. This explicitly shifts the execution of the network request and database insertion to an optimized background thread pool, guaranteeing the UI remains perfectly fluid at 60fps.
        </p>

        <h2>When to choose Cross-Platform vs. Native</h2>
        <p>
            I am not against React Native or Flutter. They are incredible tools for the right job. However, as an architect, you must evaluate the project's long-term requirements:
        </p>
        <ul>
            <li><strong>Choose Cross-Platform if:</strong> Your app is heavily form-based, primarily reads data, needs to launch quickly on a strict budget, and has minimal hardware integrations.</li>
            <li><strong>Choose Pure Native (Kotlin/Swift) if:</strong> You are building complex animations, require Bluetooth/Socket persistence, handle massive datasets locally (like our DitDash engine), or expect to scale to millions of concurrent users.</li>
        </ul>

        <h2>The Verdict</h2>
        <p>
            For enterprise-scale applications where every millisecond of latency translates to user drop-off, the predictability, type-safety, and raw performance of Kotlin is unmatched. It forces you to write better, more structurally sound software.
        </p>

        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-2">
                <span className="text-xs font-bold text-brand-muted bg-brand-offwhite px-3 py-1 rounded-full">#Kotlin</span>
                <span className="text-xs font-bold text-brand-muted bg-brand-offwhite px-3 py-1 rounded-full">#Architecture</span>
                <span className="text-xs font-bold text-brand-muted bg-brand-offwhite px-3 py-1 rounded-full">#MobileDev</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">Share:</span>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <Link className="w-4 h-4" />
                </a>
            </div>
        </div>
    </article>

    <section className="max-w-3xl mx-auto px-6 mb-24 reveal">
        <div className="bg-[#f0f4f1] border border-brand-green/10 p-8 md:p-10 rounded-sharp flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200" alt="Nikola" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0" />
            <div>
                <h4 className="text-xl font-extrabold text-brand-dark mb-2">Written by Nikola.</h4>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                    Senior App Developer based in Nigeria. I specialize in building high-performance native architectures and solving complex engineering bottlenecks for global startups and enterprises.
                </p>
                <a href="about.html" className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-brand-orange transition-colors">
                    More about me <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    </section>

    <section className="py-24 bg-brand-offwhite border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-10 reveal">
                <h2 className="text-3xl font-extrabold tracking-tighter text-brand-dark">Keep Reading</h2>
                <a href="blog.html" className="text-sm font-bold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                    View all posts <ArrowRight className="w-4 h-4" />
                </a>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 reveal">
                <a href="#" className="flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all group">
                    <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Data" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Mobile Dev</span>
                            <span className="text-xs font-medium text-brand-muted">March 28, 2026</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">State Management in Large React Native Projects</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">
                            Lessons learned from building UP Social. How to keep your global state from becoming a bottleneck.
                        </p>
                    </div>
                </a>

                <a href="#" className="flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all group">
                    <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                        <img src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=800" alt="Code" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">Kotlin</span>
                            <span className="text-xs font-medium text-brand-muted">Feb 14, 2026</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">Mastering Coroutines for Zero-Latency Apps</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">
                            A deep dive into structuring threading architectures to ensure real-time translation without UI freezes.
                        </p>
                    </div>
                </a>
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
        </div>
    </section>
    </>
  )
}

export default BlogView