"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
    }

    // Clean social_links if they still contain resume fields
    let sl = (profile?.social_links as any) || {
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
    };

    if (sl.resume_url) delete sl.resume_url;
    if (sl.resume_name) delete sl.resume_name;

    let resumeUrl = profile?.resume_url || (profile?.social_links as any)?.resume_url || "";
    if (resumeUrl && !resumeUrl.includes("download=")) {
        const separator = resumeUrl.includes("?") ? "&" : "?";
        resumeUrl = `${resumeUrl}${separator}download=`;
    }

    return {
        id: user.id,
        email: user.email,
        updated_at: profile?.updated_at || null,
        name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || "",
        title: profile?.title || "",
        bio: profile?.bio || "",
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
        resume_url: resumeUrl,
        resume_name: profile?.resume_name || (profile?.social_links as any)?.resume_name || "",
        skills: profile?.skills || [],
        social_links: sl
    };
}

export async function updateProfile(data: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: "Unauthorized" };

    const { email, id, ...rest } = data;
    
    // Ensure resume_url has download parameter for security/UX
    if (rest.resume_url && typeof rest.resume_url === 'string' && !rest.resume_url.includes('download=')) {
        const separator = rest.resume_url.includes('?') ? '&' : '?';
        rest.resume_url = `${rest.resume_url}${separator}download=`;
    }

    const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
            ...rest,
            id: user.id,
            updated_at: new Date().toISOString(),
        });

    if (upsertError) {
        console.error("=== UPSERT ERROR ===", upsertError);
        return { error: upsertError.message };
    }

    revalidatePath("/admin/profile");
    return { success: true };
}
