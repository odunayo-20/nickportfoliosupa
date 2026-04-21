"use server";

import { sendBrevoEmail } from '@/lib/brevo';

export async function sendReply(email: string, name: string, message: string) {
    if (!process.env.BREVO_API_KEY) {
        return { error: "BREVO_API_KEY is not configured in .env.local" };
    }

    try {
        const data = await sendBrevoEmail({
            to: [{ email, name }],
            subject: 'Re: Inquiry from your portfolio',
            htmlContent: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <p>Hello ${name},</p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
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
