"use server";

import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export interface NewsletterSubscriber {
    id: string;
    created_at: string;
    email: string;
    name: string | null;
    status: "active" | "unsubscribed";
    unsubscribed_at: string | null;
}

// ── Public Actions ────────────────────────────────────────────────────────────

export async function subscribeToNewsletter(payload: {
    email: string;
    name?: string;
}) {
    const email = payload.email.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    const admin = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await admin
        .from("newsletter_subscribers")
        .select("id, status")
        .eq("email", email)
        .maybeSingle();

    if (existing) {
        if (existing.status === "active") {
            return { error: "You are already subscribed!" };
        }
        // Re-subscribe
        const { error } = await admin
            .from("newsletter_subscribers")
            .update({ status: "active", unsubscribed_at: null, name: payload.name ?? null })
            .eq("id", existing.id);

        if (error) return { error: error.message };
        return { success: true, resubscribed: true };
    }

    const { error } = await admin
        .from("newsletter_subscribers")
        .insert({ email, name: payload.name ?? null });

    if (error) return { error: error.message };
    return { success: true };
}

export async function unsubscribeFromNewsletter(email: string) {
    const admin = createAdminClient();

    const { error } = await admin
        .from("newsletter_subscribers")
        .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
        .eq("email", email.trim().toLowerCase());

    if (error) return { error: error.message };
    return { success: true };
}

// ── Admin Actions ─────────────────────────────────────────────────────────────

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const admin = createAdminClient();
    const { data, error } = await admin
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
    return data as NewsletterSubscriber[];
}

export async function deleteNewsletterSubscriber(id: string) {
    const admin = createAdminClient();
    const { error } = await admin
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/newsletter");
    return { success: true };
}

export async function updateSubscriberStatus(id: string, status: "active" | "unsubscribed") {
    const admin = createAdminClient();
    const { error } = await admin
        .from("newsletter_subscribers")
        .update({
            status,
            unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null,
        })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/newsletter");
    return { success: true };
}
