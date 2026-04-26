"use server";

import { createClient } from "@/lib/server";

export async function getPublicProfile() {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, title, bio, avatar_url, resume_url, social_links")
        .limit(1)
        .maybeSingle();

    if (error) {
        // console.error("Error fetching public profile:", error);
        return null;
    }

    // console.log("=== PUBLIC PROFILE DB RESULT ===", profile);

    if (profile) {
        const sl = profile.social_links as any;
        if (!profile.resume_url && sl?.resume_url) {
            profile.resume_url = sl.resume_url;
        }

        // Force download parameter for security/UX
        if (profile.resume_url && !profile.resume_url.includes("download=")) {
            const separator = profile.resume_url.includes("?") ? "&" : "?";
            profile.resume_url = `${profile.resume_url}${separator}download=`;
        }
    }

    // console.log("=== PUBLIC PROFILE FINAL RESULT ===", profile);

    return profile;
}
