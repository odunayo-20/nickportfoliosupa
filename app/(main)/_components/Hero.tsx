import React from 'react'
import { Play } from 'lucide-react'

const Hero = () => {
    return (
       

            <header id="home" className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center min-h-[85vh]">
                <div className="reveal">
                    <div className="inline-block px-4 py-1.5 border border-dashed border-brand-muted mb-6">
                        <span className="text-brand-muted font-medium text-sm">Hello There!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-brand-dark">
                        I'm <span className="text-brand-orange">Nikola,</span><br />
                        Senior App Dev<br />
                        Based in Nigeria.
                    </h1>

                    <p className="text-brand-muted text-lg max-w-md mb-10 leading-relaxed">
                        I'm an experienced App Developer with 8+ years in the field, collaborating with various startups to build high-performance architectures.
                    </p>

                    <div className="flex items-center gap-4">
                        <button className="px-8 py-3.5 bg-brand-green text-white font-bold rounded-full flex items-center gap-3 hover:bg-brand-dark transition-all shadow-lg">
                            View My Portfolio <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><Play className="w-3 h-3 text-brand-green ml-0.5" /></div>
                        </button>
                        <button className="px-8 py-3.5 border border-gray-300 font-bold rounded-full hover:border-brand-dark transition-all bg-white">
                            Hire Me
                        </button>
                    </div>
                </div>

                <div className="relative flex justify-center items-center h-[500px] reveal">
                    <div className="absolute right-0 w-[85%] h-[90%] bg-brand-orange blob-shape -z-10"></div>

                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                        alt="Nikola"
                        className="w-[75%] h-[90%] object-cover object-top blob-shape shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />

                        <div className="absolute top-12 -right-4 w-24 h-24 bg-brand-green rounded-full flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest text-center border-4 border-white shadow-xl animate-[spin_10s_linear_infinite]">
                            Hire Me • Hire Me •
                        </div>
                        <div className="absolute bottom-24 right-10 bg-brand-orange text-brand-dark font-bold text-xs px-4 py-2 rounded-full shadow-lg border-2 border-white">
                            Java & Kotlin
                        </div>
                        <div className="absolute bottom-10 left-10 bg-brand-green text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-brand-orange border-b-[5px] border-b-transparent"></div>
                            Architecture Expert
                        </div>
                </div>
            </header>
       
    )
}

export default Hero