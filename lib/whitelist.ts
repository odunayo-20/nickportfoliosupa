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

    // 2. Check Database table
    const admin = createAdminClient();
    const { data, error } = await admin
        .from('allowed_users')
        .select('email')
        .ilike('email', lowerEmail)
        .single();

    if (data) return true;
    
    return false;
}
