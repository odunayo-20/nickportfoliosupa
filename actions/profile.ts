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

    console.log("=== GET PROFILE: raw social_links from DB ===", JSON.stringify(profile?.social_links));

    return {
        id: user.id,
        email: user.email,
        updated_at: profile?.updated_at || null,
        name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || "",
        title: profile?.title || "",
        bio: profile?.bio || "",
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
        skills: profile?.skills || [],
        social_links: (profile?.social_links as any) || {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
        }
    };
}

export async function updateProfile(data: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: "Unauthorized" };

    const { resume_url, email, id, ...rest } = data;

    console.log("=== UPDATE PROFILE: social_links being saved ===", JSON.stringify(rest.social_links));

    const { data: saved, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
            ...rest,
            id: user.id,
            updated_at: new Date().toISOString(),
        })
        .select("social_links")
        .single();

    if (upsertError) {
        console.error("=== UPSERT ERROR ===", upsertError);
        return { error: upsertError.message };
    }

    console.log("=== UPDATE PROFILE: social_links returned by DB after save ===", JSON.stringify(saved?.social_links));

    revalidatePath("/admin/profile");
    return { success: true };
}
