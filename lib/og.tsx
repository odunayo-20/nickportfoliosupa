import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

/** Satori (ImageResponse) only decodes PNG/JPEG, while most covers are WebP — so only embed those. */
async function loadCover(url?: string | null): Promise<string | null> {
  if (!url || !/^https?:/.test(url)) return null
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
    const type = res.headers.get('content-type') ?? ''
    if (!res.ok || !/image\/(png|jpe?g)/.test(type)) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${type};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

function clip(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[\s,.;:–-]+$/, '')}…`
}

/**
 * Branded social card (Phase 4): dark green panel, orange accent, title, and on the right
 * either the cover image (PNG/JPEG) or a generated orbit graphic.
 */
export async function renderOgCard({ kicker, title, subtitle, image, site }: { kicker: string; title: string; subtitle?: string | null; image?: string | null; site: string }) {
  const cover = await loadCover(image)
  const long = title.length > 48
  const rings = [460, 360, 260, 160]

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#1e3628', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 56px 56px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: '#ffb800', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 }}>
              {site[0]}
            </div>
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
              {site}<span style={{ color: '#ffb800' }}>.</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ffb800', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3 }}>
              <div style={{ width: 32, height: 3, background: '#ffb800', flexShrink: 0 }} />
              {clip(kicker, 48)}
            </div>
            <div style={{ display: 'flex', fontSize: long ? 54 : 66, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 660 }}>{clip(title, 90)}</div>
            {subtitle && <div style={{ display: 'flex', fontSize: 25, lineHeight: 1.35, color: 'rgba(255,255,255,0.65)', maxWidth: 640 }}>{clip(subtitle, 120)}</div>}
          </div>
          <div style={{ display: 'flex', height: 6, width: 140, borderRadius: 6, background: '#ffb800' }} />
        </div>

        <div style={{ width: 430, height: '100%', display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', background: '#2a4736', overflow: 'hidden' }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img>
            <img src={cover} alt="" width={430} height={630} style={{ width: 430, height: 630, objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', position: 'relative', width: 430, height: 630, alignItems: 'center', justifyContent: 'center' }}>
              {rings.map((d, i) => (
                <div key={d} style={{ position: 'absolute', width: d, height: d, borderRadius: 999, border: `2px solid rgba(255,184,0,${0.12 + i * 0.1})` }} />
              ))}
              <div style={{ position: 'absolute', top: 118, left: 300, width: 22, height: 22, borderRadius: 999, background: '#ffb800' }} />
              <div style={{ position: 'absolute', top: 470, left: 92, width: 14, height: 14, borderRadius: 999, background: '#8cc5a2' }} />
              <div style={{ display: 'flex', width: 96, height: 96, borderRadius: 999, background: '#ffb800', color: '#1a1a1a', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900 }}>
                {site[0]}
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: '#ffb800' }} />
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
