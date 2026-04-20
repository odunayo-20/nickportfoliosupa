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

    // 2. Create the user using Admin API (which auto-confirms if configured or we can set it)
    const { data, error: signupError } = await admin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Automatically confirm the email
    });

    if (signupError) {
      return NextResponse.json(
        { error: signupError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully and auto-confirmed.' },
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
