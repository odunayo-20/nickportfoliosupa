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
      router.push("/auth/login");
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
                Inbox
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
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <MessageCircle className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-400">No messages yet</p>
                <p className="text-xs text-slate-300 mt-1">Messages from your portfolio will appear here</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center py-16 border border-slate-100 rounded-2xl text-center">
                 <p className="text-sm font-medium text-slate-400">No recent activity</p>
                 <p className="text-xs text-slate-300 mt-1">Your latest updates will show here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;