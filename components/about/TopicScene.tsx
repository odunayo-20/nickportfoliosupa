import type { CSSProperties } from 'react'
import Image from 'next/image'
import { LAYER_SIZES } from './layerSizes'

export type TopicKey = 'android' | 'kmp' | 'ios' | 'backend' | 'ui' | 'web'

type Role = 'hero' | 'link' | 'char' | ''
/** [image, centre x %, centre y %, width %, depth, role] — listed back to front. */
type Layer = readonly [string, number, number, number, number, Role]

/** Each illustration split into layers, placed as a percentage of the square frame. */
const SCENES: Record<TopicKey, readonly Layer[]> = {
    kmp: [['code-window', 25.5, 30, 23, 5, 'link'], ['kmp-card-sourcesets', 20, 52.5, 20, 7, 'link'], ['kmp-card-android', 48.7, 14.5, 12.5, 9, 'link'], ['kmp-card-ios', 69, 20, 12, 10, 'link'], ['kmp-card-desktop', 82, 36, 13, 11, 'link'], ['kmp-card-web', 25.5, 70, 12.5, 9, 'link'], ['kmp-hero', 52, 46.5, 30, 14, 'hero'], ['plant', 14, 80, 10, 6, ''], ['kmp-cube-kotlin', 40, 79, 15, 17, ''], ['kmp-cube-code', 51.5, 82, 12, 19, ''], ['character', 73, 69, 34, 22, 'char']],
    android: [['code-window', 24.5, 36, 19, 5, 'link'], ['android-card-code', 64, 26, 10, 8, 'link'], ['android-card-rocket', 76.5, 25, 11, 9, 'link'], ['android-card-leaf', 65, 39.5, 10.5, 10, 'link'], ['android-tile-kotlin', 19.7, 59, 11, 9, 'link'], ['android-phone', 43.5, 48, 29, 14, 'hero'], ['android-plant-green', 87, 76, 7, 6, ''], ['android-android-head', 25, 76, 18, 19, ''], ['character', 72, 64, 33, 22, 'char']],
    ios: [['code-window', 23, 37, 20, 5, 'link'], ['ios-card-appstore', 66, 26, 10.5, 8, 'link'], ['ios-card-layout', 79.5, 31.5, 11, 9, 'link'], ['ios-card-swift-small', 66.5, 42.5, 11.5, 10, 'link'], ['ios-tile-swift', 20.5, 59.5, 12, 9, 'link'], ['ios-phone', 44, 47.5, 29, 14, 'hero'], ['plant', 81, 82, 9, 6, ''], ['ios-macbook', 29, 77, 30, 19, ''], ['character', 73, 66, 33, 22, 'char']],
    backend: [['code-window', 22.7, 34, 22, 5, 'link'], ['backend-cloud', 46.5, 12, 19, 8, 'link'], ['backend-card-rest', 70.7, 17, 11.5, 9, 'link'], ['backend-card-postgres', 74.5, 30, 11, 10, 'link'], ['backend-card-redis', 76.5, 42, 11, 11, 'link'], ['backend-card-jwt', 73.2, 53.5, 9.5, 12, 'link'], ['backend-db-stack', 19.7, 62, 16, 8, 'link'], ['backend-hero', 49.7, 47.5, 30, 14, 'hero'], ['plant', 16, 77, 12, 6, ''], ['backend-cube-terminal', 33.5, 79, 12.5, 17, ''], ['backend-cube-kotlin', 52.5, 80, 11.5, 19, ''], ['character', 76, 72, 33, 22, 'char']],
    ui: [['ui-search', 48.5, 10.5, 23.5, 6, 'link'], ['ui-card-login', 24.5, 30.5, 18, 7, 'link'], ['ui-card-image', 24.2, 58.5, 17.5, 8, 'link'], ['ui-card-chart', 73.5, 24.5, 14, 9, 'link'], ['ui-icon-heart', 68, 41, 6.2, 10, ''], ['ui-icon-bell', 75.3, 41, 6.2, 11, ''], ['ui-icon-gear', 82.5, 41, 6.2, 12, ''], ['ui-phone', 49.5, 45, 28, 14, 'hero'], ['plant', 14.5, 75, 13, 6, ''], ['ui-navbar', 39.5, 80.5, 31, 17, ''], ['ui-tile-type', 61.5, 80.5, 8.5, 18, ''], ['ui-cube-pen', 50.8, 89, 9, 19, ''], ['character-phone', 79, 73, 32, 22, 'char']],
    web: [['code-window', 20.5, 31, 17, 5, 'link'], ['web-card-html', 35, 14, 9, 8, 'link'], ['web-card-css', 46.7, 14.5, 9, 9, 'link'], ['web-card-js', 58, 15, 9, 9, 'link'], ['web-card-react', 68.7, 15.5, 9, 10, 'link'], ['web-card-api', 16.5, 54, 15.5, 7, 'link'], ['web-card-database', 81, 30, 13, 10, 'link'], ['web-card-deployment', 82, 48, 15, 11, 'link'], ['web-hero', 51, 43.5, 40, 14, 'hero'], ['web-card-domain', 29, 73, 8.5, 15, ''], ['web-card-hosting', 39.3, 72.8, 8.5, 15, ''], ['web-card-backend', 49.7, 72.5, 8.5, 16, ''], ['web-card-performance', 60, 72.2, 8.5, 16, ''], ['plant', 17, 76, 12, 6, ''], ['web-cube-code', 36.5, 85, 10, 18, ''], ['web-cube-gear', 52.7, 84.5, 10, 19, ''], ['character', 80, 75, 33, 22, 'char']],
}

const SPARKS = [[12, 38], [30, 14], [58, 8], [88, 30], [90, 58], [62, 90], [36, 60], [8, 62]] as const

const layerSrc = (name: string) => `/about/layers/${name}.webp`

/** Every image a topic's scene needs — used to warm the cache before the scene is shown. */
export const sceneImages = (topic: TopicKey) => SCENES[topic].map(l => layerSrc(l[0]))

/**
 * One topic's illustration, built from separate layers so each piece can fly in, bob and shift
 * with the pointer. `still` freezes it (no motion, no parallax) for the cards stacked behind the frame.
 * The navy backdrop and motion are CSS (`.topic-scene` in main.css); the parent sets `--px` / `--py`.
 */
export function TopicScene({ topic, label, still = false }: { topic: TopicKey; label: string; still?: boolean }) {
    const layers = SCENES[topic]
    const hero = layers.find(l => l[5] === 'hero') ?? layers[0]
    let order = 0

    return (
        <div className={still ? "topic-scene topic-still" : "topic-scene"} role="img" aria-label={`${label} illustration`}>
            {/* Dashed connectors from the centre card to its satellites, with flowing dashes */}
            <svg viewBox="0 0 100 100" className="topic-links" aria-hidden="true">
                {layers.filter(l => l[5] === 'link').map(l => (
                    <path key={l[0]} d={`M${hero[1]} ${hero[2]}H${l[1]}V${l[2]}`} />
                ))}
            </svg>

            {SPARKS.map(([x, y], i) => (
                <span key={i} className="topic-spark" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${-i * 0.4}s` }} />
            ))}

            {layers.map(([name, x, y, w, depth, role]) => {
                const [iw, ih] = LAYER_SIZES[name] ?? [340, 340]
                const i = role === 'hero' ? 0 : ++order
                const style = {
                    left: `${x}%`, top: `${y}%`, width: `${w}%`,
                    '--d': depth, '--i': i, '--dx': x - 50, '--dy': y - 50,
                } as CSSProperties
                return (
                    <div key={name} className="topic-layer" style={style}>
                        <Image src={layerSrc(name)} alt="" width={iw} height={ih} unoptimized loading={still ? 'lazy' : 'eager'} draggable={false} />
                    </div>
                )
            })}
        </div>
    )
}
