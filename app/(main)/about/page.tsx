import { Microscope, Code2, Gauge } from 'lucide-react'
const About = () => {
  return (
    <>
     <header className="bg-brand-green text-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center reveal">
            <div>
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-6">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Journey
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-8">
                    Bridging the gap between <span className="text-brand-orange italic font-normal">design</span> & <span className="text-brand-orange italic font-normal">logic.</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-lg mb-8">
                    With over 8 years in the tech industry, I don't just write code. I architect scalable systems that provide flawless user experiences. I believe that the best applications are built where rigorous engineering meets intuitive design.
                </p>
                <div className="flex gap-4">
                    <a href="#timeline" className="px-8 py-3.5 bg-brand-orange text-brand-dark font-bold rounded-full hover:bg-white transition-all">
                        View Experience
                    </a>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-brand-orange -translate-x-4 translate-y-4 rounded-sharp -z-10"></div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                     alt="Nikola Collaboration" 
                     className="w-full aspect-[4/3] object-cover rounded-sharp border-4 border-brand-green grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
        </div>
    </header>

    <section className="py-24 bg-brand-offwhite">
        <div className="max-w-7xl mx-auto px-6 reveal">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold tracking-tighter text-brand-dark mb-6">My Engineering Philosophy</h2>
                <p className="text-brand-muted text-lg">I approach every project with three core pillars in mind. This ensures that the final product is not only beautiful but built to last.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Microscope className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">1. Investigate & Architect</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Before writing a single line of code, I map out the data flow, state management, and edge cases to ensure the foundation is rock solid.</p>
                </div>
                
                <div className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Code2 className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">2. Clean Execution</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Utilizing Kotlin, Java, and modern web frameworks to write DRY, modular, and heavily documented code that other developers love to read.</p>
                </div>
                
                <div className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Gauge className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">3. Zero-Latency Focus</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Performance is a feature. I strictly monitor memory allocation and network payloads to ensure native-level speeds across all devices.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="timeline" className="py-32 bg-brand-light">
        <div className="max-w-4xl mx-auto px-6 reveal">
            <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Professional Timeline
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-16">8+ Years of Building.</h2>
            
            <div className="relative border-l-2 border-brand-green/20 pl-8 ml-4 space-y-16">
                
                <div className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-orange rounded-full group-hover:bg-brand-orange transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Senior App Developer</h3>
                        <span className="text-brand-orange font-bold text-sm bg-brand-orange/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">2023 - Present</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">OdunGlobal</h4>
                    <p className="text-brand-muted leading-relaxed">
                        Leading the native mobile engineering team. Architected and deployed scalable Kotlin-based enterprise solutions resulting in a 40% reduction in app crash rates and a 200% increase in daily active users.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-green rounded-full group-hover:bg-brand-green transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Lead Mobile Engineer</h3>
                        <span className="text-brand-muted font-bold text-sm bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">2020 - 2023</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">UP Social App</h4>
                    <p className="text-brand-muted leading-relaxed">
                        Spearheaded the development of a real-time event discovery platform. Implemented complex state management protocols and optimized real-time database syncing protocols for seamless user interactions.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-green rounded-full group-hover:bg-brand-green transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Software Engineer</h3>
                        <span className="text-brand-muted font-bold text-sm bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">2016 - 2020</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">DitDash & Independent Freelance</h4>
                    <p className="text-brand-muted leading-relaxed">
                        Developed utility applications utilizing low-level device APIs. Started career building responsive web interfaces and transitioned into native Java/Kotlin development for specialized communication tools.
                    </p>
                </div>
                
            </div>
        </div>
    </section>
    
    </>
  )
}

export default About