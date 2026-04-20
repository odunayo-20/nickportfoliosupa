import { createClient } from "@/lib/server";
import { BarChart3, Users, MousePointer2, Clock, Globe, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: totalVisits },
    { data: uniqueVisitors },
    { data: topPages },
    { data: recentVisits }
  ] = await Promise.all([
    supabase.from('page_visits').select('*', { count: 'exact', head: true }),
    supabase.rpc('get_unique_visitors_count'),
    supabase.from('page_visits').select('page_url').then(({ data }) => {
        // Fallback if RPC isn't ready or just simple aggregation
        const counts: Record<string, number> = {};
        data?.forEach(v => {
            counts[v.page_url] = (counts[v.page_url] || 0) + 1;
        });
        return { data: Object.entries(counts).map(([url, count]) => ({ page_url: url, visit_count: count })).sort((a,b) => b.visit_count - a.visit_count).slice(0, 10) };
    }),
    supabase.from('page_visits')
      .select('*, profiles:user_id(name)')
      .order('visited_at', { ascending: false })
      .limit(10)
  ]);

  const stats = [
    { name: 'Total Visits', value: totalVisits || 0, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Unique Visitors', value: uniqueVisitors || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Avg. per Page', value: totalVisits ? (totalVisits / (topPages?.length || 1)).toFixed(1) : 0, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your portfolio's performance and visitor engagement.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Most Visited Pages</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topPages?.map((page) => (
              <div key={page.page_url} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate max-w-xs md:max-w-md lg:max-w-lg">
                    {page.page_url}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                    {page.visit_count} visits
                  </span>
                </div>
              </div>
            ))}
            {(!topPages || topPages.length === 0) && (
              <div className="p-8 text-center text-slate-500">No data available yet.</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Recent Visits</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentVisits?.map((visit) => (
              <div key={visit.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {visit.profiles?.name || 'Anonymous User'}
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                        {visit.ip_address}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3" /> {visit.page_url}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatDistanceToNow(new Date(visit.visited_at), { addSuffix: true })}
                </span>
              </div>
            ))}
            {(!recentVisits || recentVisits.length === 0) && (
                <div className="p-8 text-center text-slate-500">No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
