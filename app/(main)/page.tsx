import { ProjectCard } from "@/components/ProjectCard";
import { BlogCard } from "@/components/BlogCard";
import Link from "next/link";

const MOCK_PROJECTS = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with next-gen performance, built with React and advanced caching.",
    imageUrl: "/mock-1",
    href: "#",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
  },
  {
    title: "Task Management App",
    description: "Real-time task collaboration tool for remote teams featuring optimistic UI updates.",
    imageUrl: "/mock-2",
    href: "#",
    tags: ["React", "Node.js", "Redis", "WebSockets"],
  },
  {
    title: "AI Writing Assistant",
    description: "Browser extension that helps you write better emails and documents using LLMs.",
    imageUrl: "/mock-3",
    href: "#",
    tags: ["Vue", "OpenAI API", "Chrome Extension"],
  },
];

const MOCK_BLOGS = [
  {
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring upcoming trends in frontend frameworks and edge computing architectures.",
    date: "April 12, 2024",
    readTime: "5 min read",
    href: "#",
  },
  {
    title: "Mastering TypeScript Generics",
    excerpt: "A deep dive into advanced TypeScript patterns to make your code more robust and reusable.",
    date: "March 28, 2024",
    readTime: "8 min read",
    href: "#",
  },
  {
    title: "Building Fast APIs with Rust",
    excerpt: "Why transitioning to Rust for our core microservices drastically improved latency and throughput.",
    date: "March 15, 2024",
    readTime: "6 min read",
    href: "#",
  },
];

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Rust", "PostgreSQL", "Supabase", "Tailwind CSS",
  "GraphQL", "Docker"
];

export default function Home() {
  return (

    <>
      {/* <!-- Hero Section --> */}
      <section className="relative min-h-screen pt-32 pb-20 px-8 flex flex-col lg:flex-row items-center justify-between overflow-hidden">
        {/* <!-- Background Blobs --> */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-2xl text-left z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-surface-container-high text-primary rounded-full border border-primary/20">Available for Projects</span>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            Alex <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">Rivera</span>
          </h1>
          <p className="font-headline text-2xl md:text-3xl text-white/90 font-medium mb-4">Cross-Platform App Developer</p>
          <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed">
            Building seamless mobile experiences across iOS &amp; Android. I turn complex problems into elegant, high-performance digital products.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-gradient-to-br from-primary to-secondary text-on-secondary font-bold rounded-full hover:shadow-[0_0_30px_rgba(153,247,255,0.4)] transition-all active:scale-95">
              View My Work
            </button>
            <button className="px-8 py-4 bg-surface-container-high/40 border border-outline-variant/30 text-white font-bold rounded-full hover:bg-surface-container-high/60 transition-all active:scale-95 backdrop-blur-md">
              Hire Me
            </button>
          </div>
        </div>
        {/* <!-- Phone Mockup Container --> */}
        <div className="relative mt-20 lg:mt-0 w-full lg:w-1/2 flex justify-center">
          <div className="relative w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#222] shadow-2xl overflow-hidden glass-card">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#222] rounded-b-2xl z-20"></div>
            <div className="w-full h-full p-4 overflow-hidden">
              <img className="w-full h-full object-cover rounded-[2rem] opacity-90" data-alt="vibrant mobile app UI showing data visualization charts with neon purple and cyan colors on a dark sleek dashboard interface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqFk2JtQtiheCdbWc3Rjg0UX1odfamFYyTpRYNXDs_ZnVyzrvGQymkXRoNbUprAthOUlrqAdRb2yHVnwAgViuQWyCL_85s5KzhQrh_021V1z5OPdPgMf3ELLQNL_iypxW82sWKUPH5NOWAodmFcTxxFr8YoZx91K8Xsnx3quWD_8mcL1cSsTexfshAUyWD2Bue0prCLDYaWVIJHWRRUfd7nSHC6M20J_H3on4AWRJZPDi11KGIWMwe6uA53AD7SlW4sDohn9E2TH0" />
            </div>
            {/* <!-- Floating Elements around phone --> */}
            <div className="absolute -right-8 top-1/4 glass-card p-4 rounded-2xl border border-primary/20 shadow-xl hidden md:block">
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
            </div>
            <div className="absolute -left-12 bottom-1/3 glass-card p-4 rounded-2xl border border-secondary/20 shadow-xl hidden md:block">
              <span className="material-symbols-outlined text-secondary text-3xl">favorite</span>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Stats Section --> */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <p className="font-headline text-5xl font-bold text-primary neon-text-glow">25+</p>
              <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">Apps Built</p>
            </div>
            <div className="space-y-2">
              <p className="font-headline text-5xl font-bold text-secondary">1M+</p>
              <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">Users Served</p>
            </div>
            <div className="space-y-2">
              <p className="font-headline text-5xl font-bold text-tertiary">5+</p>
              <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">Years Experience</p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Tech Stack Section --> */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="font-label text-primary uppercase tracking-[0.2em] text-xs mb-4 block">The Arsenal</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold leading-tight">High-Performance Tech for Premium Results</h2>
          </div>
          <p className="text-on-surface-variant text-lg max-w-xs leading-relaxed">Leveraging cutting-edge frameworks to deliver native performance with cross-platform efficiency.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* <!-- Tech Cards --> */}
          <div className="glass-card p-10 rounded-3xl flex flex-col items-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-4xl">flutter</span>
            </div>
            <p className="font-headline font-bold text-xl">Flutter</p>
          </div>
          <div className="glass-card p-10 rounded-3xl flex flex-col items-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary text-4xl">javascript</span>
            </div>
            <p className="font-headline font-bold text-xl text-center">React Native</p>
          </div>
          <div className="glass-card p-10 rounded-3xl flex flex-col items-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6 border border-tertiary/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary text-4xl">database</span>
            </div>
            <p className="font-headline font-bold text-xl">Firebase</p>
          </div>
          <div className="glass-card p-10 rounded-3xl flex flex-col items-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-4xl">sprint</span>
            </div>
            <p className="font-headline font-bold text-xl">Swift</p>
          </div>
        </div>
      </section>
      {/* <!-- Featured Apps (Bento Grid) --> */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <h2 className="font-headline text-4xl md:text-5xl font-bold mb-16">Featured <span className="text-primary">Deployments</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
          {/* <!-- App 1: Project Capsule Style --> */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl glass-card border border-white/10 hover:border-primary/50 transition-all duration-500 min-h-[400px]">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" data-alt="Modern dark mode fintech app interface showing cryptocurrency trends and wallet balance with neon accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkqkG-f67I9lc_-Wa3K8_V0iLUoBlNRlsa-g_Ktrma2y5ApQPWyKbXU1Iy42reJ6EsbP94IrfKuLPre6Cxpdjq-b4hDb7TF1iMLEd-aaRMT8Z4IBwF0OYNfhbF7ximb_ZrM1lKcqnyxumq3U0cLVyqM7fkdQe_wNKb29Or_DEfMBNEIoFZeKzPVpbkTEdk3actd7_LyFOFBi0HNYDKGP4FHCaMxVjrODnviOlGBzGdrMzPqjFEqXF2bipGSXRaooj0OJu1-gkgl8" />
            </div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-end bg-gradient-to-t from-background via-transparent to-transparent">
              <div className="mb-4 flex gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Fintech</span>
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">iOS &amp; Android</span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-2">CryptoPulse v2</h3>
              <p className="text-on-surface-variant max-w-md mb-6">A real-time cryptocurrency tracker with custom alerts and portfolio management.</p>
              <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                Explore Case Study <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          {/* <!-- App 2: Square Style --> */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl glass-card border border-white/10 hover:border-secondary/50 transition-all duration-500">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" data-alt="Fitness tracking mobile app UI with vibrant neon colors showing workout metrics and progress circles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiGq5t2RdyUpcjrk-OaXNXtH7nsvaQrDTnEQA8h67HdEato4klYmc1lpbEvXYue9mSrRpNwF15t5IT3jRd3MVyKsXciBxcRNaFGd3W2VaySxclQ6wjLJvI0wemQSAetZJ1zjZpU5VeW0dq3EfRvrT7Ac1DVLN0Fu90fPpdkbmUfL-XwT1r2-5RwxRATlGYQGrOxF6DH47lBNDrnL8jDIP8J3pSz1MhN5maDzPqj8Tdqmz1ImtNJtfCAlNEdZ7ikuP5OMUrlMNzXo8" />
            </div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-end bg-gradient-to-t from-background via-transparent to-transparent">
              <h3 className="font-headline text-2xl font-bold mb-2">Kinetic Fit</h3>
              <p className="text-on-surface-variant text-sm mb-6">AI-driven personal training companion for professional athletes.</p>
              <span className="material-symbols-outlined text-secondary text-3xl">fitness_center</span>
            </div>
          </div>
          {/* <!-- App 3: Small Horizontal --> */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl glass-card border border-white/10 hover:border-tertiary/50 transition-all duration-500">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" data-alt="Travel mobile application UI with minimalist photography focus and elegant typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT_pHc1KP3QbLAkmsSegpgaYcArxokX35XpvbS05GEUM8Y76L4r4Acfe3X46QAI0TMf2pZCPIzfSHGCHVQt0ovrqgoB9tlKzEHbYX-6i8nJGgRtSFdz2OqMwXjy3kxOpkAKG5At6Ds_J_CAZ6fddTZxPGoieLl77myjeHwApaUj7vSDOjetRyK3rG3v5DFfhZhri8eoX4imhq5u1qCQOH2n49wl9Q8XE9isPrNg7MdAoTBAyQBS_4P85sckBfLk6o7NTfT1GtW1N8" />
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-background via-transparent to-transparent">
              <h3 className="font-headline text-2xl font-bold mb-2">Nomad Soul</h3>
              <p className="text-on-surface-variant text-sm">Travel itinerary planner for solo adventurers.</p>
            </div>
          </div>
          {/* <!-- App 4: Large Horizontal --> */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl glass-card border border-white/10 hover:border-primary/50 transition-all duration-500 min-h-[300px]">
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-container-high/40">
              <div className="text-primary/20 scale-150 rotate-12">
                <span className="material-symbols-outlined text-[10rem]">smart_toy</span>
              </div>
            </div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-center items-start">
              <span className="font-label text-tertiary text-xs uppercase tracking-widest mb-2">Coming Soon</span>
              <h3 className="font-headline text-3xl font-bold mb-4">Aura AI Assistant</h3>
              <p className="text-on-surface-variant max-w-sm mb-6">Next-gen voice assistant integrated with custom LLM architectures.</p>
              <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-tertiary"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Footer --> */}
    </>
  );
}
