export async function sendBrevoEmail({
    to,
    subject,
    htmlContent,
    sender
}: {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    sender?: { name: string; email: string };
}) {
    const apiKey = process.env.BREVO_API_KEY;
    const defaultSender = {
        name: process.env.BREVO_SENDER_NAME || "Portfolio",
        email: process.env.BREVO_SENDER_EMAIL || "no-reply@brevo.com"
    };

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": apiKey,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: sender || defaultSender,
            to,
            subject,
            htmlContent
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to send email via Brevo");
    }

    return data;
}
