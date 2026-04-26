import Hero from './_components/Hero'
import Tools from './_components/Tools'
import Skills from './_components/Skills';
import Services from './_components/Services';
import About from './_components/About';
import { getPublicProfile } from '@/actions/public_profile';

const Home = async () => {
    const profile = await getPublicProfile();

    return (
        <>

            <Hero profile={profile} />

            {/* Our Service */}

            <Services />

            {/* About us */}
            <About profile={profile} />


            {/* Tools */}
            <Tools />

            {/* ── Skills ── */}

            <Skills />
        </>
    )
}

export default Home