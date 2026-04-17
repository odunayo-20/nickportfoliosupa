import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get("next") ?? "/admin/dashboard";

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data?.user?.email) {
            const email = data.user.email;
            
            // --- Whitelist Check ---
            let isWhitelisted = false;
            
            // 1. Check local file
            try {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(process.cwd(), 'whitelisted_emails.json');
                if (fs.existsSync(filePath)) {
                    const localWhitelist = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    if (Array.isArray(localWhitelist) && localWhitelist.includes(email)) {
                        isWhitelisted = true;
                    }
                }
            } catch (e) {}

            // 2. Check Database (using same client)
            if (!isWhitelisted) {
                const { data: allowed } = await supabase
                    .from('allowed_users')
                    .select('email')
                    .eq('email', email)
                    .single();
                if (allowed) isWhitelisted = true;
            }

            if (!isWhitelisted) {
                // Not whitelisted! Sign out and redirect
                await supabase.auth.signOut();
                return NextResponse.redirect(`${origin}/auth/login?error=unauthorized_email`);
            }
            // --- End Whitelist Check ---

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
