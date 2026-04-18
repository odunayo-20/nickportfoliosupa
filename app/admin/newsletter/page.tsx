import { getNewsletterSubscribers } from "@/actions/newsletter";
import { NewsletterTable } from "./_components/NewsletterTable";
import { Mail, Users, UserCheck, UserMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Newsletter — Admin",
};

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Newsletter</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your audience and track subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Subscribers</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{subscribers.length}</div>
            <p className="text-xs text-slate-400 mt-1">Growth: +0% this week</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active</CardTitle>
            <UserCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</div>
            <p className="text-xs text-slate-400 mt-1">Validating emails...</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Unsubscribed</CardTitle>
            <UserMinus className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{unsubscribedCount}</div>
            <p className="text-xs text-slate-400 mt-1">Retention rate: 0%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" />
              Subscribers List
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Showing {subscribers.length} records</span>
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
