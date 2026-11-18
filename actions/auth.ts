"use server";

import { createClient } from "@/lib/server";
import { createAdminClient } from "@/lib/admin";
import { isEmailWhitelisted } from "@/lib/whitelist";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
}

/**
 * Used by the forgot-password form. Public endpoint, so it must not reveal whether an address is
 * whitelisted or registered: callers get the same neutral answer either way, and a reset email is
 * only actually sent (by the caller) when `exists` is true.
 */
export async function checkEmailExists(email: string) {
    const neutral = { exists: false, error: undefined as string | undefined };
    if (typeof email !== "string" || email.length > 254) return neutral;

    if (!(await isEmailWhitelisted(email))) return neutral;

    const admin = createAdminClient();
    const lower = email.toLowerCase();
    // listUsers is paginated (50/page by default); walk the pages.
    for (let page = 1; page <= 20; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error || !data?.users?.length) break;
        if (data.users.some((u) => u.email?.toLowerCase() === lower)) return { exists: true, error: undefined };
        if (data.users.length < 200) break;
    }
    return neutral;
}

export async function changePassword(newPassword: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

