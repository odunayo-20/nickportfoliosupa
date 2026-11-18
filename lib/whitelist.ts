import { createAdminClient } from "@/lib/admin";
import fs from 'fs';
import path from 'path';

export async function isEmailWhitelisted(email: string): Promise<boolean> {
    const lowerEmail = email.toLowerCase();

    // 1. Check local JSON file
    try {
        const filePath = path.join(process.cwd(), 'whitelisted_emails.json');
        if (fs.existsSync(filePath)) {
            const localWhitelist = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(localWhitelist) && localWhitelist.some(e => e.toLowerCase() === lowerEmail)) {
                return true;
            }
        }
    } catch (e) {
        console.error('Error reading JSON whitelist:', e);
    }

    // 2. Check Database table — case-insensitive EXACT match. (`ilike(email, input)` treated `_`
    //    and `%` in the input as wildcards: `____@gmail.com` matched any 4-char gmail address.)
    const escaped = lowerEmail.replace(/[\\%_]/g, (c) => `\\${c}`);
    const admin = createAdminClient();
    const { data } = await admin
        .from('allowed_users')
        .select('email')
        .ilike('email', escaped)
        .limit(1);

    return !!data?.some((row) => row.email?.toLowerCase() === lowerEmail);
}
