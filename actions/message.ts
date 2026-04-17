"use server";

import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function getMessages() {
    const admin = createAdminClient();
    const { data, error } = await admin
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });


    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data;
}

export async function markAsRead(id: string) {
    const admin = createAdminClient();
    const { error } = await admin
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);


    if (error) return { error: error.message };
    revalidatePath('/admin/message');
    return { success: true };
}

export async function deleteMessage(id: string) {
    const admin = createAdminClient();
    const { error } = await admin
        .from('messages')
        .delete()
        .eq('id', id);


    if (error) return { error: error.message };
    revalidatePath('/admin/message');
    return { success: true };
}
