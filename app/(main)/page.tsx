"use client";

import Hero from './_components/Hero'
import Tools from './_components/Tools'
import Skills from './_components/Skills';
import Services from './_components/Services';
import About from './_components/About';


const Home = () => {
    return (
        <>

            <Hero />

            {/* Our Service */}

            <Services />

            {/* About us */}
            <About />


            {/* Tools */}
            <Tools />

            {/* ── Skills ── */}

            <Skills />
        </>
    )
}

export default Home