import { useId } from 'react'

export type SkillMotifKey = 'mobile' | 'web' | 'chip' | 'chart'

/** One phone whose list scrolls forever; two of them side by side read as "same code, both platforms". */
function Phone({ x }: { x: number }) {
    const clip = useId()
    return (
        <>
            <clipPath id={clip}>
                <rect x={x + 3} y={16} width={36} height={78} />
            </clipPath>
            <rect x={x} y={8} width={42} height={94} rx={7} className="s" />
            <path d={`M${x + 16} 12h10`} className="s" />
            <g clipPath={`url(#${clip})`}>
                <g className="m-scroll">
                    {Array.from({ length: 10 }, (_, i) => (
                        <rect key={i} x={x + 7} y={20 + i * 16} width={28} height={10} rx={2} className={i % 4 === 1 ? 'a' : 'f'} />
                    ))}
                </g>
            </g>
        </>
    )
}

const delay = (s: number) => ({ animationDelay: `${s}s` })

/** Empty browser window that the web drawings fill in. */
const BrowserFrame = () => (
    <>
        <rect x={12} y={10} width={136} height={90} rx={6} className="s" />
        <path d="M12 26h136" className="s" />
        <circle cx={21} cy={18} r={2} className="f" />
        <circle cx={28} cy={18} r={2} className="f" />
        <circle cx={35} cy={18} r={2} className="f" />
        <rect x={50} y={14.5} width={60} height={7} rx={3.5} className="f" />
    </>
)

/** A signal dot that travels (dx, dy) along a trace into the chip. */
const go = (dx: number, dy: number, wait = 0) =>
    ({ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${wait}s` }) as React.CSSProperties

const BARS = [20, 34, 26, 42, 30]

const MOTIFS: Record<SkillMotifKey, () => React.ReactNode> = {
    // Android and iOS scrolling the same list
    mobile: () => (
        <>
            <Phone x={30} />
            <Phone x={88} />
        </>
    ),
    // A browser page that builds itself block by block
    web: () => (
        <>
            <BrowserFrame />
            <rect x={22} y={36} width={64} height={9} rx={2} className="a m-build" />
            <rect x={22} y={50} width={88} height={4} rx={2} className="f m-build" style={delay(0.25)} />
            <rect x={22} y={58} width={70} height={4} rx={2} className="f m-build" style={delay(0.4)} />
            <rect x={22} y={70} width={32} height={22} rx={2} className="f m-build" style={delay(0.6)} />
            <rect x={64} y={70} width={32} height={22} rx={2} className="f m-build" style={delay(0.75)} />
            <rect x={106} y={70} width={32} height={22} rx={2} className="f m-build" style={delay(0.9)} />
        </>
    ),
    // Sensor signals arriving at a processor
    chip: () => (
        <>
            <path d="M55 45H22M55 65H22M105 45H138M105 65H138M70 30V10M90 30V10M70 80V100M90 80V100" className="s" />
            <rect x={55} y={30} width={50} height={50} rx={6} className="s f" />
            <rect x={68} y={43} width={24} height={24} rx={3} className="a m-pulse" />
            <circle cx={22} cy={45} r={3} className="a m-go" style={go(30, 0)} />
            <circle cx={138} cy={65} r={3} className="a m-go" style={go(-30, 0, 0.45)} />
            <circle cx={90} cy={10} r={3} className="a m-go" style={go(0, 18, 0.9)} />
            <circle cx={70} cy={100} r={3} className="a m-go" style={go(0, -18, 1.35)} />
        </>
    ),
    // A dashboard whose bars and trend line keep updating
    chart: () => (
        <>
            <BrowserFrame />
            {BARS.map((h, i) => (
                <rect key={i} x={24 + i * 16} y={92 - h} width={10} height={h} rx={1.5} className={`${i === 3 ? 'a' : 'f'} m-bar`} style={delay(i * 0.22)} />
            ))}
            <path d="M22 44L40 39L56 43L72 33L96 37" pathLength={1} className="as m-draw" />
            <rect x={110} y={34} width={30} height={14} rx={2} className="f" />
            <rect x={110} y={54} width={30} height={14} rx={2} className="f" />
            <rect x={110} y={74} width={30} height={18} rx={2} className="f" />
            <circle cx={116} cy={41} r={2} className="a m-blink" />
        </>
    ),
}

/**
 * Small looping drawing for a service card, on a dot-grid panel. The drawing fills whatever size the panel has.
 * Lines take the panel's text colour; accents are brand orange. Styles live in main.css (.skill-motif).
 */
export function SkillMotif({ motif, className = '' }: { motif: SkillMotifKey; className?: string }) {
    const Drawing = MOTIFS[motif]
    return (
        <div className={`skill-motif ${className}`} aria-hidden="true">
            <svg viewBox="0 0 160 110">
                <Drawing />
            </svg>
        </div>
    )
}
