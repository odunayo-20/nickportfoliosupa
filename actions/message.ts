"use server";

import { requireAdmin } from '@/lib/auth-guard';
import { rateLimit, RATE_LIMITED } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";


export async function getMessages() {
    await requireAdmin();
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
    await requireAdmin();
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
    const name = String(payload?.name ?? "").trim();
    const email = String(payload?.email ?? "").trim();
    const message = String(payload?.message ?? "").trim();
    const subject = String(payload?.subject ?? "").slice(0, 120);
    const budget = String(payload?.budget ?? "").slice(0, 60);

    if (name.length < 2 || name.length > 100) return { error: "Please enter your name." };
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
    if (message.length < 5 || message.length > 5000) return { error: "Message must be between 5 and 5000 characters." };
    if (!(await rateLimit("contact", 5, 15 * 60_000))) return { error: RATE_LIMITED };

    // Use the admin client — this runs server-side only (Server Action),
    // so the service role key is never exposed to the browser.
    const admin = createAdminClient();

    // The messages table has: name, email, message, is_read
    // We fold subject + budget into the message body for storage.
    const formatted = [
        subject ? `Service: ${subject}` : '',
        budget ? `Budget: ${budget}` : '',
        message,
    ].filter(Boolean).join('\n\n');

    const { error } = await admin
        .from('messages')
        .insert({ name, email, message: formatted });

    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteMessage(id: string) {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
        .from('messages')
        .delete()
        .eq('id', id);


    if (error) return { error: error.message };
    revalidatePath('/admin/message');
    return { success: true };
}
