"use server";

import { createAdminClient } from "@/lib/admin";

export async function getDashboardStats() {
    const admin = createAdminClient();

    try {
        const [
            projectsCount, 
            postsCount, 
            messagesCount, 
            subscribersCount,
            commentsCount,
            messagesRes, 
            projectsRes, 
            postsRes
          ] = await Promise.all([
            admin.from("projects").select("*", { count: "exact", head: true }),
            admin.from("posts").select("*", { count: "exact", head: true }),
            admin.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
            admin.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
            admin.from("comments").select("*", { count: "exact", head: true }).eq("is_approved", false),
            admin.from("messages").select("*").order("created_at", { ascending: false }).limit(3),
            admin.from("projects").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
            admin.from("posts").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
          ]);

          const stats = {
            projects: projectsCount.count || 0,
            posts: postsCount.count || 0,
            messages: messagesCount.count || 0,
            subscribers: subscribersCount.count || 0,
            pendingComments: commentsCount.count || 0,
          };

          const recentMessages = messagesRes.data || [];
          
          const recentActivity = [
            ...(projectsRes.data || []).map((p: any) => ({ ...p, type: 'project' as const })),
            ...(postsRes.data || []).map((p: any) => ({ ...p, type: 'post' as const })),
          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

          return {
            success: true,
            stats,
            recentMessages,
            recentActivity
          };
    } catch (error: any) {
        console.error("Dashboard Stats Error:", error);
        return { success: false, error: error.message };
    }
}
