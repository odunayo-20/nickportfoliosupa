"use client"

import React, { useEffect, useState } from "react";
import { Plus, Pencil, FolderKanban, FileEdit, MessageCircle, Loader2, Clock, ChevronRight, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DashboardPage = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, user } = myAppHook(); 
  
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const [projectsCount, postsCount, messagesCount, messagesRes, projectsRes, postsRes] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
          supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(3),
          supabase.from("projects").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("posts").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        ]);

        setStats({
          projects: projectsCount.count || 0,
          posts: postsCount.count || 0,
          messages: messagesCount.count || 0,
        });

        setRecentMessages(messagesRes.data || []);
        
        const activity = [
          ...(projectsRes.data || []).map(p => ({ ...p, type: 'project' as const })),
          ...(postsRes.data || []).map(p => ({ ...p, type: 'post' as const })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

        setRecentActivity(activity);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  if (authLoading || (isLoggedIn && isLoadingStats)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "there";

  return (
    <div>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-none">
              Welcome back, {displayName}
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">
              Here&apos;s what&apos;s happening with your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/project/create">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </Link>

            <Link href="/admin/blog/create">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                <Pencil className="w-4 h-4" />
                <span>Write Post</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {/* Projects */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between min-h-[180px] group hover:border-indigo-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                Total
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none">
                {stats.projects}
              </p>
              <p className="text-sm font-medium mt-2 text-slate-500">
                Projects
              </p>
            </div>
          </div>

          {/* Blog */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between min-h-[180px] group hover:border-purple-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <FileEdit className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                Total
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none">
                {stats.posts}
              </p>
              <p className="text-sm font-medium mt-2 text-slate-500">
                Blog Posts
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col justify-between min-h-[180px] group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-white/40">
                Unread
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold text-white tracking-tight leading-none">
                {stats.messages}
              </p>
              <p className="text-sm font-medium mt-2 text-white/50">
                Messages
              </p>
            </div>
          </div>
        </div>

        {/* Bottom sections */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Messages */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Recent Messages
              </h3>
              <Link href="/admin/message" className="text-xs font-medium text-indigo-600 hover:underline underline-offset-4">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <Link href={`/admin/message?id=${msg.id}`} key={msg.id} className="block group">
                    <div className={`p-5 rounded-2xl border transition-all ${
                      msg.is_read 
                        ? 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md' 
                        : 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.is_read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'}`}>
                            <User size={14} />
                          </div>
                          <div>
                            <p className={`text-sm ${msg.is_read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                              {msg.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">{msg.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(msg.created_at))} ago
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed ml-10">
                        {msg.message}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <MessageCircle className="w-8 h-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-400">No messages yet</p>
                  <p className="text-xs text-slate-300 mt-1">Messages from your portfolio will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <Link 
                    key={`${activity.type}-${activity.id}`} 
                    href={`/admin/${activity.type === 'project' ? 'project' : 'blog'}`}
                    className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {activity.type === 'project' ? (
                          <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
                            <FolderKanban size={14} />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg">
                            <FileEdit size={14} />
                          </div>
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          {activity.type} created
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between group-hover:text-indigo-600 transition-colors">
                      <p className="text-sm font-bold text-slate-700 truncate pr-4">
                        {activity.title}
                      </p>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 border border-slate-100 rounded-2xl text-center">
                   <p className="text-sm font-medium text-slate-400">No recent activity</p>
                   <p className="text-xs text-slate-300 mt-1">Your latest updates will show here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;