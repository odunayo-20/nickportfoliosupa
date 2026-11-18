import { createAdminClient } from '@/lib/admin';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = signupSchema.parse(body);

    const admin = createAdminClient();

    // 1. Check if email is whitelisted (local file or DB)
    const { isEmailWhitelisted } = await import('@/lib/whitelist');
    const isWhitelisted = await isEmailWhitelisted(email);

    if (!isWhitelisted) {

      return NextResponse.json(
        { error: 'Signup is restricted to pre-approved users only.' },
        { status: 403 }
      );
    }

    // 2. Create the user UNCONFIRMED. Auto-confirming let anyone claim a whitelisted address
    //    they don't own; the owner of the inbox must click the confirmation link first.
    const { error: signupError } = await admin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: false,
    });

    if (signupError) {
      return NextResponse.json(
        { error: signupError.message },
        { status: 400 }
      );
    }

    // 3. Send the confirmation email (Supabase Auth mailer).
    const origin = new URL(request.url).origin;
    const { createClient } = await import('@supabase/supabase-js');
    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error: resendError } = await anon.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/admin/dashboard` },
    });
    if (resendError) console.error('Signup confirmation email failed:', resendError.message);

    return NextResponse.json(
      { message: 'Account created. Check your email to confirm it.', needsConfirmation: true },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Signup API Error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: `An unexpected error occurred: ${err.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}
