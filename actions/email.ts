"use server";

import { requireAdmin } from '@/lib/auth-guard';
import { sendBrevoEmail } from '@/lib/brevo';

// `name` comes from a public contact-form submission — never interpolate it raw into HTML.
const escapeHtml = (v: string) =>
    v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function sendReply(email: string, name: string, message: string) {
    await requireAdmin();
    if (!process.env.BREVO_API_KEY) {
        return { error: "BREVO_API_KEY is not configured in .env.local" };
    }

    try {
        const data = await sendBrevoEmail({
            to: [{ email, name }],
            subject: 'Re: Inquiry from your portfolio',
            htmlContent: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <p>Hello ${escapeHtml(name)},</p>
                    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">This is a response to your message sent via the contact form.</p>
                </div>
            `,
        });

        return { success: true, data };
    } catch (error: any) {
        return { error: error.message || "Failed to send email" };
    }
}

export async function checkEmailConfig() {
    await requireAdmin();
    return {
        isConfigured: !!process.env.BREVO_API_KEY,
        senderName: process.env.BREVO_SENDER_NAME,
        senderEmail: process.env.BREVO_SENDER_EMAIL
    };
}
