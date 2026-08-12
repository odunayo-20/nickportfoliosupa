import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/admin';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('Track visit body:', body);

    const { page_url, visitor_id, user_id } = body;

    if (!page_url || !visitor_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const headerList = await headers();

    const userAgent =
      headerList.get('user-agent') || 'Unknown';

    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'Unknown';

    console.log('Creating Supabase admin client...');

    const supabase = createAdminClient();

    console.log('Supabase client created');

    const fiveMinutesAgo = new Date(
      Date.now() - 5 * 60 * 1000
    ).toISOString();

    const { data: existingVisit, error: selectError } = await supabase
      .from('page_visits')
      .select('id')
      .eq('visitor_id', visitor_id)
      .eq('page_url', page_url)
      .gt('visited_at', fiveMinutesAgo)
      .maybeSingle();

    if (selectError) {
      console.error('Supabase SELECT error:', selectError);

      return NextResponse.json(
        {
          error: 'Failed to check existing visit',
          details: selectError.message,
        },
        { status: 500 }
      );
    }

    if (existingVisit) {
      return NextResponse.json({
        status: 'ignored',
        message: 'Duplicate visit within 5 mins',
      });
    }

    console.log('Inserting visit...');

    const { error: insertError } = await supabase
      .from('page_visits')
      .insert({
        page_url,
        visitor_id,
        user_id: user_id || null,
        ip_address: ip,
        user_agent: userAgent,
      });

    if (insertError) {
      console.error('Supabase INSERT error:', insertError);

      return NextResponse.json(
        {
          error: 'Failed to record visit',
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    console.log('Visit recorded successfully');

    return NextResponse.json({
      status: 'success',
    });
  } catch (error) {
    console.error('API Error in track-visit:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}