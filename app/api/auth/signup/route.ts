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

    // 1. Check local whitelist file (optional convenience)
    let isWhitelisted = false;
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'whitelisted_emails.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const localWhitelist = JSON.parse(fileContent);
        if (Array.isArray(localWhitelist) && localWhitelist.includes(email)) {
          isWhitelisted = true;
        }
      }
    } catch (e) {
      console.error('Error reading local whitelist:', e);
    }

    // 2. Check if email is in the database whitelist table (if not already found in file)
    if (!isWhitelisted) {
      const { data: allowed, error: whitelistError } = await admin
        .from('allowed_users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (allowed) isWhitelisted = true;
    }

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
