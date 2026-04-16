"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}

export async function updateProfile(data: ProfileUpdate) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const { data: profile, error } = await supabase
        .from("profiles")
        .upsert({ ...data, id: user.id, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/profile");
    return profile;
}
