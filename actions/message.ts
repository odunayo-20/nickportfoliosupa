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

export async function sendMessage(payload: {
    name: string;
    email: string;
    subject: string;
    budget: string;
    message: string;
}) {
    // Use the admin client — this runs server-side only (Server Action),
    // so the service role key is never exposed to the browser.
    const admin = createAdminClient();

    // The messages table has: name, email, message, is_read
    // We fold subject + budget into the message body for storage.
    const formatted = [
        payload.subject ? `Service: ${payload.subject}` : '',
        payload.budget ? `Budget: ${payload.budget}` : '',
        payload.message,
    ].filter(Boolean).join('\n\n');

    const { error } = await admin
        .from('messages')
        .insert({ name: payload.name, email: payload.email, message: formatted });

    if (error) return { error: error.message };
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
