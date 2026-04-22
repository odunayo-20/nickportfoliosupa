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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    try {
        // 2. Send individual emails to include personalized unsubscribe link
        const sendPromises = subscribers.map(async (sub) => {
            const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
            const personalizedContent = `
                <div style="font-family: sans-serif;">
                    ${payload.content}
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                        <p>You are receiving this because you are subscribed to my newsletter.</p>
                        <p>
                            <a href="${unsubscribeUrl}" style="color: #6366f1; text-decoration: underline;">Unsubscribe</a> 
                            from these emails.
                        </p>
                    </div>
                </div>
            `;

            return sendBrevoEmail({
                to: [{ email: sub.email }],
                subject: payload.subject,
                htmlContent: personalizedContent,
            });
        });

        await Promise.all(sendPromises);

        // 3. Save to campaign history
        const { error: historyError } = await admin
            .from("newsletter_campaigns")
            .insert({
                subject: payload.subject,
                content: payload.content,
                sent_at: new Date().toISOString(),
                recipient_count: subscribers.length,
                status: "sent"
            });

        if (historyError) {
            console.error("CRITICAL: Email sent but database insert failed:", historyError);
            return { error: `Success sending email, but record could not be saved to history. Error: ${historyError.message}. Check if 'newsletter_campaigns' table exists.` };
        }

        revalidatePath("/admin/newsletter/history");
        return { success: true, count: subscribers.length };
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(payload.email)}`;
    const personalizedContent = `
        <div style="font-family: sans-serif;">
            ${payload.content}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                <p>You are receiving this because you are subscribed to my newsletter.</p>
                <p>
                    <a href="${unsubscribeUrl}" style="color: #6366f1; text-decoration: underline;">Unsubscribe</a> 
                    from these emails.
                </p>
                <p style="margin-top: 10px; color: #f43f5e; font-weight: bold;">[TEST EMAIL]</p>
            </div>
        </div>
    `;

    try {
        await sendBrevoEmail({
            to: [{ email: payload.email }],
            subject: `[TEST] ${payload.subject}`,
            htmlContent: personalizedContent,
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
