"use client"

import React, { useEffect, useState } from "react";
import { Plus, Pencil, FolderKanban, FileEdit, MessageCircle, Loader2 } from "lucide-react";
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
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const [projectsCount, postsCount] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          projects: projectsCount.count || 0,
          posts: postsCount.count || 0,
          messages: 0, // Not implemented yet
        });
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

  return (
    <div>
      <div className="p-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md">Control Center</span>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Status</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              Overview
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">
              Manage your digital architecture and portfolio updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/project/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </Link>

            <Link href="/admin/blog/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                <Pencil className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Projects */}
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between h-52 group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 px-3 py-1.5 bg-indigo-50 rounded-lg uppercase tracking-widest">
                Active Project
              </span>
            </div>
            <div>
              <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                {stats.projects}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black mt-4 text-slate-400">
                Architectural Records
              </p>
            </div>
          </div>

          {/* Blog */}
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between h-52 group hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <FileEdit className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-purple-600 px-3 py-1.5 bg-purple-50 rounded-lg uppercase tracking-widest">
                Published
              </span>
            </div>
            <div>
              <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                {stats.posts}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black mt-4 text-slate-400">
                Neural Transmissions
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col justify-between h-52 group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white/50 px-3 py-1.5 bg-white/5 rounded-lg uppercase tracking-widest">
                System Log
              </span>
            </div>
            <div>
              <p className="text-5xl font-black text-white tracking-tighter leading-none">
                {stats.messages}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black mt-4 text-white/30">
                Incoming Channels
              </p>
            </div>
          </div>
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* <!-- Latest Messages (Span 3) --> */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Live Inquiries
              </h3>
              <a className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4" href="#">Historical Log</a>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                <MessageCircle className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero transmissions detected</p>
              </div>
            </div>
          </div>
          {/* <!-- Recently Updated Projects (Span 2) --> */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Delta Stream Updates</h3>
            </div>
            <div className="space-y-8">
              <div className="item-center justify-center py-20 border border-slate-100 rounded-3xl text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waiting for new deployments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;