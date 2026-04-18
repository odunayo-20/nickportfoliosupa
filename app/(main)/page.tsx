import React from 'react'
import { Asterisk, ArrowRight, Layers, Cpu, Layout, Database } from 'lucide-react'
import Hero from './_components/Hero'
import Navbar from './_components/Navbar'

const Home = () => {
  return (
    <>
  
    <Hero />
    
     <div className="bg-brand-orange py-4 overflow-hidden border-y border-brand-orange">
        <div className="marquee">
            <div className="marquee-content text-brand-dark font-semibold text-xl flex items-center gap-12">
                <span>App Design</span> <Asterisk className="w-6 h-6" />
                <span>Website Design</span> <Asterisk className="w-6 h-6" />
                <span>Dashboard</span> <Asterisk className="w-6 h-6" />
                <span>Wireframes</span> <Asterisk className="w-6 h-6" />
                <span>Kotlin Specialist</span> <Asterisk className="w-6 h-6" />
            </div>
            <div className="marquee-content text-brand-dark font-semibold text-xl flex items-center gap-12">
                <span>App Design</span> <Asterisk className="w-6 h-6" />
                <span>Website Design</span> <Asterisk className="w-6 h-6" />
                <span>Dashboard</span> <Asterisk className="w-6 h-6" />
                <span>Wireframes</span> <Asterisk className="w-6 h-6" />
                <span>Kotlin Specialist</span> <Asterisk className="w-6 h-6" />
            </div>
        </div>
    </div>


       <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 reveal">
            <div>
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> Services
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark">Services I Provide</h2>
            </div>
            <button className="px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-full flex items-center gap-3 hover:bg-brand-dark transition-colors">
                View All Services <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3 text-brand-green" /></div>
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                    <Layers className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand-dark">UI/UX Implementation</h3>
                <p className="text-brand-muted text-sm mb-6 leading-relaxed">Translating complex designs into pixel-perfect, performant native mobile interfaces with zero layout shift.</p>
                <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                </a>
            </div>
            <div className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                    <Cpu className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand-dark">Application Design</h3>
                <p className="text-brand-muted text-sm mb-6 leading-relaxed">Architecting robust Android applications focusing on Kotlin Coroutines, clean architecture, and memory safety.</p>
                <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                </a>
            </div>
            <div className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                    <Layout className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand-dark">Website Design</h3>
                <p className="text-brand-muted text-sm mb-6 leading-relaxed">Developing robust web backends and high-performance frontends that scale seamlessly to millions of users.</p>
                <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    </section>

    <section id="about" className="bg-brand-green py-24 overflow-hidden text-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="relative w-full max-w-md mx-auto aspect-square reveal">
                <div className="absolute inset-4 bg-brand-orange rounded-full -translate-x-6 -translate-y-6"></div>
                
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
                     alt="Nikola Working" 
                     className="absolute inset-0 w-full h-full object-cover rounded-full z-10 border-8 border-brand-green grayscale" />
                
                <div className="absolute z-20 top-1/4 -left-8 bg-brand-dark text-brand-orange text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">UX/UI Design</div>
                <div className="absolute z-20 top-1/2 -left-12 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-light">Mobile App Design</div>
                <div className="absolute z-20 bottom-1/4 -left-4 bg-brand-orange text-brand-dark text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Design System</div>
                
                <div className="absolute z-20 top-1/3 -right-6 bg-brand-orange text-brand-dark text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Website Design</div>
                <div className="absolute z-20 bottom-1/3 right-0 bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Prototype</div>
                <div className="absolute z-20 bottom-12 right-12 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-light">Dashboard</div>
            </div>

            <div className="reveal">
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> About Me
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                    Who is <span className="text-brand-orange font-normal italic">Nikola?</span>
                </h2>
                
                <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-lg">
                    I am a software architect driven by logic and efficient systems. Over the last 8 years, I've delivered massive architectural overhauls for global clients, ensuring every line of code adds tangible business value.
                </p>
                
                <div className="grid grid-cols-3 gap-6 mb-12 border-b border-gray-600/50 pb-10">
                    <div>
                        <div className="text-3xl font-bold text-brand-orange mb-1">600+</div>
                        <div className="text-xs text-gray-400 font-medium">Project Completed</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brand-orange mb-1">50+</div>
                        <div className="text-xs text-gray-400 font-medium">Industry Covered</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brand-orange mb-1">18+</div>
                        <div className="text-xs text-gray-400 font-medium">Years of Experience</div>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-8">
                    <button className="px-6 py-3 bg-brand-light text-brand-dark font-bold text-sm rounded-full flex items-center gap-3 hover:bg-brand-orange transition-colors">
                        Download CV <div className="w-6 h-6 bg-brand-dark rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3 text-brand-light" /></div>
                    </button>
                    <div className="font-serif italic text-2xl text-brand-orange opacity-90">
                        Nikola.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="tools" className="max-w-4xl mx-auto px-6 py-24 text-center reveal">
        <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-2">
            <span className="w-4 h-[2px] bg-brand-orange"></span> My Favorite Tools
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-16">
            Exploring the Tools<br/>Behind My Designs
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" alt="Kotlin" className="w-10 h-10 grayscale hover:grayscale-0 transition-all"/>
            </div>
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" className="w-10 h-10 grayscale hover:grayscale-0 transition-all"/>
            </div>
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" className="w-10 h-10 grayscale hover:grayscale-0 transition-all"/>
            </div>
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-10 h-10 grayscale hover:grayscale-0 transition-all"/>
            </div>
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" className="w-10 h-10 grayscale hover:grayscale-0 transition-all"/>
            </div>
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                <Database className="w-8 h-8 text-gray-500" />
            </div>
        </div>
    </section>



    </>
  )
}

export default Home