import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: React.ReactNode
  /** Seconds for one full loop. */
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
}

/**
 * Infinite horizontal marquee (pure CSS, so it works without JS and costs nothing per frame).
 * Content is rendered twice; the second copy is hidden from screen readers and keyboard (inert).
 * Edges fade out with a mask. Stops for reduced motion (see .marquee-track in main.css).
 */
export function Marquee({ children, duration = 30, reverse, pauseOnHover = true, className }: MarqueeProps) {
  const track = cn(
    'marquee-track flex shrink-0 min-w-full items-center justify-around gap-[var(--marquee-gap)]',
    reverse && 'marquee-reverse',
  )
  return (
    <div
      className={cn(
        pauseOnHover && 'marquee-pausable',
        'flex overflow-hidden gap-[var(--marquee-gap)] [--marquee-gap:1.5rem]',
        '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div className={track}>{children}</div>
      <div className={track} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  )
}
