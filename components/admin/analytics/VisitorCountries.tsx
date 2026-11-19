import { geoEqualEarth, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import countries from 'i18n-iso-countries'
import world from 'world-atlas/countries-110m.json'
import { Globe2, MapPin } from 'lucide-react'

export type CountryRow = { country: string; visits: number; visitors: number }

const W = 960, H = 470

// Built once per server process: the world outline doesn't change.
type WorldTopo = Parameters<typeof feature>[0] & { objects: { countries: Parameters<typeof feature>[1] } }
const topo = world as unknown as WorldTopo
const land = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>
const projection = geoEqualEarth().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' })
const path = geoPath(projection)
const SHAPES = land.features
  .filter((f) => f.properties.name !== 'Antarctica')
  .map((f) => ({ id: f.id ? String(f.id) : '', name: f.properties.name, d: path(f) ?? '' }))

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const nameOf = (code: string) => { try { return regionNames.of(code) ?? code } catch { return code } }
// Regional-indicator emoji: 'HR' -> 🇭🇷
const flagOf = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)))

/**
 * Visitor geography: a world choropleth (rendered to static SVG on the server, no client JS)
 * plus a ranked country list. `rows` come from the visits_by_country() RPC.
 */
export function VisitorCountries({ rows, available }: { rows: CountryRow[]; available: boolean }) {
  const total = rows.reduce((s, r) => s + r.visits, 0)
  const max = rows[0]?.visits ?? 0
  const byNumeric = new Map<string, CountryRow>()
  for (const r of rows) {
    const n = countries.alpha2ToNumeric(r.country)
    if (n) byNumeric.set(n, r)
  }
  // Log scale so one dominant country doesn't wash every other one out.
  const intensity = (v: number) => (max <= 1 ? 1 : 0.25 + 0.75 * (Math.log(v) / Math.log(max)))

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Visitor Countries</h2>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm">
          {rows.length} {rows.length === 1 ? 'country' : 'countries'}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3">
        {/* Map */}
        <div className="xl:col-span-2 p-4 sm:p-6 border-b xl:border-b-0 xl:border-r border-slate-50 dark:border-slate-800">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="World map of visitors by country" className="w-full h-auto">
            {SHAPES.map((s, i) => {
              const r = byNumeric.get(s.id)
              return (
                <path
                  key={`${s.id}-${i}`}
                  d={s.d}
                  className={`stroke-white dark:stroke-slate-900 transition-[fill-opacity] duration-200 ${r ? 'fill-indigo-500 hover:fill-indigo-600' : 'fill-slate-200 dark:fill-slate-700 hover:fill-slate-300 dark:hover:fill-slate-600'}`}
                  strokeWidth={0.5}
                  fillOpacity={r ? intensity(r.visits) : 1}
                >
                  <title>{r ? `${s.name}: ${r.visits} visits · ${r.visitors} visitors` : `${s.name}: no visits`}</title>
                </path>
              )
            })}
          </svg>
          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Fewer
            <span className="h-2 w-24 rounded-full bg-gradient-to-r from-indigo-500/25 to-indigo-500" />
            More
          </div>
        </div>

        {/* Ranked list */}
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {rows.slice(0, 10).map((r, idx) => {
            const share = total ? (r.visits / total) * 100 : 0
            return (
              <div key={r.country} className="px-5 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-black text-slate-200 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-lg leading-none" aria-hidden="true">{flagOf(r.country)}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{nameOf(r.country)}</span>
                  </div>
                  <span className="text-xs font-black text-slate-500 tabular-nums shrink-0">
                    {r.visits} <span className="text-slate-300 font-bold">· {share.toFixed(share < 10 ? 1 : 0)}%</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(2, share)}%` }} />
                </div>
              </div>
            )
          })}
          {rows.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {available ? 'No country data yet' : 'Country tracking not enabled yet'}
              </p>
              <p className="text-xs text-slate-400 max-w-[16rem]">
                {available
                  ? 'Countries are recorded on the live site (Vercel adds them to each visit). Local visits have no country.'
                  : 'Apply the page_visits_country migration to start recording countries.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
