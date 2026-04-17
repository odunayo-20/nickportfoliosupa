import { createClient } from "@/lib/server";
import { isEmailWhitelisted } from "@/lib/whitelist";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/admin/dashboard";

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data?.user?.email) {
            const email = data.user.email;
            
            // Check whitelist
            const allowed = await isEmailWhitelisted(email);

            if (!allowed) {
                // Not whitelisted! Sign out and redirect
                await supabase.auth.signOut();
                return NextResponse.redirect(`${origin}/auth/login?error=unauthorized_email`);
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
