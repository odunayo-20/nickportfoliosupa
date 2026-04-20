import { getNewsletterSubscribers } from "@/actions/newsletter";
import { NewsletterTable } from "./_components/NewsletterTable";
import { Mail, Users, UserCheck, UserMinus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Newsletter — Admin",
};

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Newsletter</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your audience and track subscriptions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/newsletter/history" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full font-bold gap-2 rounded-xl h-11 border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
              <Mail className="w-4 h-4 text-slate-400" />
              History
            </Button>
          </Link>
          <Link href="/admin/newsletter/compose" className="flex-1 sm:flex-none">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 font-bold gap-2 shadow-lg shadow-slate-200 rounded-xl h-11 transition-all active:scale-95">
              <Send className="w-4 h-4" />
              Compose
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6 sm:p-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Audience</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{subscribers.length}</div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Active list members</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6 sm:p-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Healthy Status</CardTitle>
             <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{activeCount}</div>
            <div className="text-[11px] font-bold text-emerald-500 mt-2 uppercase tracking-tight flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live and delivering
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6 sm:p-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Churn Rate</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <UserMinus className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{unsubscribedCount}</div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Inactive subscribers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-xl shadow-slate-200/20 bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem]">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/50 py-6 sm:py-8 px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <Mail className="w-4 h-4" />
              </div>
              Audience Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                {subscribers.length} TOTAL RECORDS
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <NewsletterTable initialSubscribers={subscribers} />
        </CardContent>
      </Card>
    </div>
  );
}
