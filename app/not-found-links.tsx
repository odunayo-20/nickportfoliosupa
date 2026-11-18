"use client";

import Link from "next/link";
import { m } from "motion/react";
import { FlowField } from "@/components/motion/FlowField";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { SplitText } from "@/components/motion/SplitText";
import { RollText } from "@/components/motion/RollText";
import { PointerEffects } from "@/components/motion/PointerEffects";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SiteMarker } from "@/components/theme/SiteMarker";
import { fadeInUp, stagger } from "@/lib/motion";

/** Background flow field (pointer-reactive) + theme toggle in the corner. */
export function NotFoundVisual() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_85%)]">
        <FlowField />
      </div>
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <PointerEffects />
      <SiteMarker />
    </>
  );
}

const QUICK_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export function NotFoundLinks() {
  return (
      <m.div initial="hidden" animate="visible" variants={stagger(0.1, 0.1)} className="flex flex-col items-center">
        <m.p
          variants={fadeInUp}
          aria-hidden="true"
          className="font-mono font-black leading-none tracking-tighter select-none text-[clamp(6rem,22vw,11rem)] text-transparent bg-clip-text bg-gradient-to-br from-brand-green to-brand-orange dark:from-accent-green"
        >
          <ScrambleText text="404" duration={1400} />
        </m.p>

        <m.div variants={fadeInUp} className="w-16 h-[3px] bg-brand-orange rounded-full my-6" />

        <SplitText as="h1" immediate delay={0.3} className="text-3xl md:text-4xl font-extrabold tracking-tighter text-ink mb-4">
          This page wandered off.
        </SplitText>

        <m.p variants={fadeInUp} className="text-ink-muted leading-relaxed mb-10 max-w-md">
          It may have been moved, renamed, or never existed. Try one of these instead.
        </m.p>

        <m.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-fill px-8 py-3.5 bg-brand-green text-white font-bold text-sm rounded-full transition-colors duration-300">
            ← Back home
          </Link>
          <Link href="/contact" className="btn-fill px-8 py-3.5 border-2 border-accent-green text-accent-green font-bold text-sm rounded-full transition-colors duration-300 [--fill:var(--color-brand-green)] [--fill-ink:#fff]">
            Contact me
          </Link>
        </m.div>

        <m.nav variants={fadeInUp} aria-label="Popular pages" className="mt-12 flex flex-wrap gap-6 justify-center text-sm font-semibold text-ink-muted">
          {QUICK_LINKS.map(({ label, href }) => (
            <Link key={href} href={href}>
              <RollText>{label}</RollText>
            </Link>
          ))}
        </m.nav>
      </m.div>
  );
}
