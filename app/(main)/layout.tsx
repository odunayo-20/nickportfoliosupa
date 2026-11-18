import "../main.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import ScrollProgress from "@/components/motion/ScrollProgress";
import PageTransition from "@/components/motion/PageTransition";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { PointerEffects } from "@/components/motion/PointerEffects";
import { CommandPalette } from "@/components/CommandPalette";
import { getSearchIndex } from "@/lib/search-index";
import { SiteMarker } from "@/components/theme/SiteMarker";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = await getSearchIndex();
  return (
    <SmoothScroll>
    <div className="site-root bg-surface text-ink antialiased selection:bg-brand-orange selection:text-brand-dark min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <PageTransition>
        <main className="flex-grow">
          {children}
        </main>
      </PageTransition>
      <Footer />
      <SiteMarker />
        <CommandPalette index={searchIndex} />
      <Cursor />
      <PointerEffects />
    </div>
    </SmoothScroll>
  );
}
