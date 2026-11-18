import Hero from './_components/Hero'
import Tools from './_components/Tools'
import Skills from './_components/Skills';
import Services from './_components/Services';
import About from './_components/About';
import FeaturedWork, { type FeaturedProject } from './_components/FeaturedWork';
import Testimonials from './_components/Testimonials';
import { DotStream } from '@/components/motion/DotStream';
import { getPublicProfile } from '@/actions/public_profile';
import { getPublishedProjects } from '@/actions/projects';

type ProjectRow = {
    slug: string; title: string; category?: string | null; is_featured?: boolean | null;
    display_order?: number | null; imageUrl?: string | null; image_url?: string | null; tech_stack?: string[] | null;
};

const Home = async () => {
    const [profile, projects] = await Promise.all([
        getPublicProfile(),
        getPublishedProjects().catch(() => []),
    ]);

    // Featured first, then by display order — at most 6 cards in the pinned gallery
    const featured: FeaturedProject[] = ((projects ?? []) as ProjectRow[])
        .slice()
        .sort((a, b) => Number(!!b.is_featured) - Number(!!a.is_featured) || (a.display_order ?? 0) - (b.display_order ?? 0))
        .slice(0, 6)
        .map((p) => ({ slug: p.slug, title: p.title, category: p.category ?? null, image: p.imageUrl || p.image_url || null, tech: p.tech_stack ?? [] }));

    return (
        <>
            <Hero profile={profile} />

            <Services />

            {/* H2: dot-stream divider */}
            <DotStream className="h-24 md:h-28" />

            <About profile={profile} />

            <FeaturedWork projects={featured} />

            <Tools />

            <Skills />

            <Testimonials />
        </>
    )
}

export default Home
