import { createClient } from "@/lib/server";
import { BarChart3, Users, MousePointer2, Clock, Globe, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Helper to fetch data safely
  const safeFetch = async (promise: any, fallback: any = null) => {
    try {
      const { data, error, count } = await promise;
      if (error) {
          console.error("Fetch error:", error);
          return fallback;
      }
      return data || count || fallback;
    } catch (e) {
      console.error("Exception during fetch:", e);
      return fallback;
    }
  };

  // Fetch stats individually to avoid entire page failure
  const totalVisitsCount = await safeFetch(supabase.from('page_visits').select('*', { count: 'exact', head: true }), 0);
  const uniqueVisitorsCount = await safeFetch(supabase.rpc('get_unique_visitors_count'), 0);
  
  // Recent visits with fallback for timestamp column
  let { data: recentVisits, error: recentError } = await supabase
    .from('page_visits')
    .select('*, profiles:user_id(name)')
    .order('visited_at', { ascending: false })
    .limit(10);

  // If visited_at order failed, try created_at
  if (recentError) {
      const result = await supabase
        .from('page_visits')
        .select('*, profiles:user_id(name)')
        .order('created_at', { ascending: false })
        .limit(10);
      recentVisits = result.data;
  }

  // Top Pages aggregation
  const { data: allVisits } = await supabase.from('page_visits').select('page_url').limit(1000);
  const counts: Record<string, number> = {};
  allVisits?.forEach(v => {
      counts[v.page_url] = (counts[v.page_url] || 0) + 1;
  });
  const topPages = Object.entries(counts)
    .map(([url, count]) => ({ page_url: url, visit_count: count }))
    .sort((a,b) => b.visit_count - a.visit_count)
    .slice(0, 10);

  const stats = [
    { name: 'Total Visits', value: totalVisitsCount, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Unique Visitors', value: uniqueVisitorsCount, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Avg. per Page', value: totalVisitsCount ? (totalVisitsCount / (topPages.length || 1)).toFixed(1) : 0, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Track your portfolio's performance and visitor engagement.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
             <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">Live View Enabled</div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Metric</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Most Visited Pages</h2>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm">Top 10</div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {topPages?.map((page, idx) => (
              <div key={page.page_url} className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs font-black text-slate-200 group-hover:text-indigo-200 transition-colors">0{idx + 1}</span>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate pr-4">
                            {page.page_url}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-black px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg uppercase tracking-widest border border-indigo-100 shadow-sm">
                    {page.visit_count} hits
                  </span>
                </div>
              </div>
            ))}
            {(!topPages || topPages.length === 0) && (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                      <BarChart3 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No site data captured</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Activity</h2>
            </div>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm">Live Stream</div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentVisits?.map((visit) => (
              <div key={visit.id} className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex flex-col min-w-0 pr-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                        {visit.profiles?.name || 'Anonymous Guest'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold tabular-nums bg-slate-50 px-1.5 py-0.5 rounded sm:inline hidden">
                        {visit.ip_address}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5 uppercase tracking-tight truncate">
                    <Globe className="w-3.5 h-3.5 text-slate-200 group-hover:text-emerald-300 transition-colors" /> {visit.page_url}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-tighter shrink-0">
                  {formatDistanceToNow(new Date(visit.visited_at || visit.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
            {(!recentVisits || recentVisits.length === 0) && (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Streaming zero packets</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
