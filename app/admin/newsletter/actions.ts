"use server";

import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { sendBrevoEmail } from "@/lib/brevo";

export interface NewsletterCampaign {
    id: string;
    created_at: string;
    subject: string;
    content: string;
    sent_at: string | null;
    recipient_count: number;
    status: "draft" | "sent";
}

export async function sendNewsletter(payload: {
    subject: string;
    content: string;
}) {
    const admin = createAdminClient();

    // 1. Get all active subscribers
    const { data: subscribers, error: subError } = await admin
        .from("newsletter_subscribers")
        .select("email")
        .eq("status", "active");

    if (subError) return { error: subError.message };
    if (!subscribers || subscribers.length === 0) {
        return { error: "No active subscribers found." };
    }

    const recipientEmails = subscribers.map(s => ({ email: s.email }));

    try {
        // 2. Send email via Brevo
        await sendBrevoEmail({
            to: recipientEmails,
            subject: payload.subject,
            htmlContent: payload.content,
        });

        // 3. Save to campaign history
        const { error: historyError } = await admin
            .from("newsletter_campaigns")
            .insert({
                subject: payload.subject,
                content: payload.content,
                sent_at: new Date().toISOString(),
                recipient_count: recipientEmails.length,
                status: "sent"
            });

        if (historyError) {
            console.error("CRITICAL: Email sent but database insert failed:", historyError);
            return { error: `Success sending email, but record could not be saved to history. Error: ${historyError.message}. Check if 'newsletter_campaigns' table exists.` };
        }

        revalidatePath("/admin/newsletter/history");
        return { success: true, count: recipientEmails.length };
    } catch (err: any) {
        return { error: err.message || "An unexpected error occurred." };
    }
}

export async function getNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
    const admin = createAdminClient();
    const { data, error } = await admin
        .from("newsletter_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
    return data as NewsletterCampaign[];
}

export async function sendTestNewsletter(payload: {
    subject: string;
    content: string;
    email: string;
}) {
    try {
        await sendBrevoEmail({
            to: [{ email: payload.email }],
            subject: `[TEST] ${payload.subject}`,
            htmlContent: payload.content,
        });

        return { success: true };
    } catch (err: any) {
        return { error: err.message || "An unexpected error occurred." };
    }
}

export async function deleteNewsletterCampaign(id: string) {
    const admin = createAdminClient();
    const { error } = await admin
        .from("newsletter_campaigns")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/newsletter/history");
    return { success: true };
}
