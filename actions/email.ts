"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReply(email: string, name: string, message: string) {
    if (!process.env.RESEND_API_KEY) {
        return { error: "RESEND_API_KEY is not configured in .env.local" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Inquiry Response <onboarding@resend.dev>', // You should update this to your domain once verified
            to: [email],
            subject: 'Re: Inquiry from your portfolio',
            text: message,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <p>Hello ${name},</p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">This is a response to your message sent via the contact form.</p>
                  
                </div>
            `,
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        return { error: error.message || "Failed to send email" };
    }
}
