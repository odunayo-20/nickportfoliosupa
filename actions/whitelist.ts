"use server";

import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function getAllowedUsers() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('allowed_users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching allowed users:', error);
    return [];
  }
  return data;
}

export async function addAllowedUser(email: string) {
  if (!email) return { error: "Email is required" };
  
  const admin = createAdminClient();
  const { error } = await admin
    .from('allowed_users')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') return { error: "Email already in whitelist" };
    return { error: error.message };
  }

  revalidatePath('/admin/whitelist');
  return { success: true };
}

export async function removeAllowedUser(id: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from('allowed_users')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/whitelist');
  return { success: true };
}
