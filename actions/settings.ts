"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

// Try to find the first settings row, or fallback to the master ID
async function getMasterId(supabase: any) {
    const { data } = await supabase.from("settings").select("id").limit(1).maybeSingle();
    return data?.id || '00000000-0000-0000-0000-000000000000';
}

export async function getSettings() {
    const supabase = await createClient();
    
    // First try by limited selection to find the actual row
    const { data: settings, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error fetching settings:", error);
        return null;
    }

    return settings;
}

export async function updateSettings(data: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Check whether a settings row already exists
    const { data: existingRow } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .maybeSingle();

    const payload = {
        ...data,
        updated_at: new Date().toISOString(),
    };

    if (existingRow) {
        // Row exists — use a plain UPDATE (avoids Supabase's upsert UUID cast bug)
        const { error } = await supabase
            .from("settings")
            .update(payload)
            .eq("id", existingRow.id);

        if (error) {
            console.error("Error updating settings:", error);
            return { error: error.message };
        }
    } else {
        // No row yet — INSERT with the master nil UUID as a stable id
        const { error } = await supabase
            .from("settings")
            .insert({ ...payload, id: "00000000-0000-0000-0000-000000000000" });

        if (error) {
            console.error("Error inserting settings:", error);
            return { error: error.message };
        }
    }

    revalidatePath("/", "layout");
    return { success: true };
}
