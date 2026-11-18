import { TESTIMONIALS } from '@/lib/content'
import { QuoteCarousel } from '@/components/motion/QuoteCarousel'
import { SplitText } from '@/components/motion/SplitText'

/** Phase 4 testimonials (proposal C4). Renders nothing until lib/content.ts has real quotes. */
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null
  return (
    <section aria-label="Testimonials" className="bg-surface py-24">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
          <span className="w-4 h-[2px] bg-brand-orange" /> Kind words
        </span>
        <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink mb-12">What people say</SplitText>
        <QuoteCarousel items={TESTIMONIALS} />
      </div>
    </section>
  )
}
