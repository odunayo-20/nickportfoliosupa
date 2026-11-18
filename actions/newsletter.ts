"use server";

import { requireAdmin } from '@/lib/auth-guard';
import { createAdminClient } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { sendBrevoEmail } from "@/lib/brevo";
import { unsubscribeUrl, verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { rateLimit, RATE_LIMITED } from "@/lib/rate-limit";

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
    const email = String(payload?.email ?? "").trim().toLowerCase();

    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }
    if (payload.name && String(payload.name).length > 100) {
        return { error: "Name is too long." };
    }
    // Each call sends an email to the given address — limit it so it can't be used to spam people.
    if (!(await rateLimit("subscribe", 5, 15 * 60_000))) return { error: RATE_LIMITED };

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
        
        // Send welcome back email
        try {
            await sendBrevoEmail({
                to: [{ email, name: payload.name ?? undefined }],
                subject: "Welcome back to my newsletter!",
                htmlContent: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #0f172a;">Welcome back!</h2>
                        <p style="color: #334155; line-height: 1.6;">It's great to have you back in the community. You've been successfully re-subscribed to my newsletter.</p>
                        <p style="color: #334155; line-height: 1.6;">You'll start receiving updates on my latest projects, blog posts, and insights again soon.</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #94a3b8;">You are receiving this because you re-subscribed to my newsletter. If this was a mistake, you can <a href="${unsubscribeUrl(email)}" style="color: #6366f1; text-decoration: underline;">unsubscribe</a> at any time.</p>
                    </div>
                `
            });
        } catch (e) {
            console.error("Failed to send welcome back email:", e);
        }

        return { success: true, resubscribed: true };
    }

    const { error } = await admin
        .from("newsletter_subscribers")
        .insert({ email, name: payload.name ?? null });

    if (error) return { error: error.message };

    // Send welcome email
    try {
        await sendBrevoEmail({
            to: [{ email, name: payload.name ?? undefined }],
            subject: "Thanks for joining my newsletter!",
            htmlContent: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0f172a;">Thanks for subscribing!</h2>
                    <p style="color: #334155; line-height: 1.6;">I'm really excited to have you here. You'll now receive occasional updates about my work, new articles, and other interesting things I find.</p>
                    <p style="color: #334155; line-height: 1.6;">In the meantime, feel free to check out my <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="color: #6366f1; text-decoration: none;">portfolio</a> or read my latest <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/blog" style="color: #6366f1; text-decoration: none;">blog posts</a>.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #94a3b8;">You are receiving this because you subscribed to my newsletter. You can <a href="${unsubscribeUrl(email)}" style="color: #6366f1; text-decoration: underline;">unsubscribe</a> at any time.</p>
                </div>
            `
        });
    } catch (e) {
        console.error("Failed to send welcome email:", e);
    }

    return { success: true };
}

/**
 * With a valid signed token (from the link in any newsletter email) the address is unsubscribed
 * immediately. Without one (typed in by hand, or an old link from before tokens existed), we email
 * a signed confirmation link to that address instead — so nobody can unsubscribe someone else.
 */
export async function unsubscribeFromNewsletter(rawEmail: string, token?: string | null) {
    const email = String(rawEmail ?? "").trim().toLowerCase();
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }
    if (!(await rateLimit("unsubscribe", 10, 15 * 60_000))) return { error: RATE_LIMITED };

    const admin = createAdminClient();

    if (verifyUnsubscribeToken(email, token)) {
        const { error } = await admin
            .from("newsletter_subscribers")
            .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
            .eq("email", email);

        if (error) return { error: "Something went wrong. Please try again." };
        return { success: true as const };
    }

    // No/invalid token: send a confirmation link, but only to an active subscriber. The response
    // is the same either way so this can't be used to check who is subscribed.
    const { data: sub } = await admin
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .eq("status", "active")
        .maybeSingle();

    if (sub) {
        try {
            await sendBrevoEmail({
                to: [{ email }],
                subject: "Confirm unsubscribe",
                htmlContent: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <p style="color: #334155; line-height: 1.6;">Someone (hopefully you) asked to unsubscribe this address from my newsletter.</p>
                        <p><a href="${unsubscribeUrl(email)}" style="color: #6366f1; text-decoration: underline;">Click here to confirm and unsubscribe</a>.</p>
                        <p style="font-size: 12px; color: #94a3b8;">If it wasn't you, just ignore this email.</p>
                    </div>
                `,
            });
        } catch (e) {
            console.error("Failed to send unsubscribe confirmation:", e);
        }
    }
    return { success: true as const, confirmationSent: true };
}

// ── Admin Actions ─────────────────────────────────────────────────────────────

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    await requireAdmin();
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
    await requireAdmin();
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
    await requireAdmin();
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
