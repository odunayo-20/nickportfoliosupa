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

export async function checkEmailExists(email: string) {
    // 1. Check if they are in the whitelist
    const allowed = await isEmailWhitelisted(email);
    
    if (!allowed) {
        return { exists: false, error: "This email is not authorized to access this site." };
    }

    // 2. Check if they actually have an account in Supabase Auth
    const admin = createAdminClient();
    const { data: { users }, error: authError } = await admin.auth.admin.listUsers();
    const userInAuth = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!userInAuth) {
        return { exists: false, error: "You are authorized, but haven't created an account yet. Please sign up first." };
    }
    
    return { exists: true };
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

