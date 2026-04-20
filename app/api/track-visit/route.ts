import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/admin';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { page_url, visitor_id, user_id } = await req.json();
    
    if (!page_url || !visitor_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || 'Unknown';
    // Get IP from common headers
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 
               headerList.get('x-real-ip') || 
               'Unknown';

    const supabase = createAdminClient();

    // 5-minute duplicate prevention logic
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: existingVisit } = await supabase
      .from('page_visits')
      .select('id')
      .eq('visitor_id', visitor_id)
      .eq('page_url', page_url)
      .gt('visited_at', fiveMinutesAgo)
      .maybeSingle();

    if (existingVisit) {
      return NextResponse.json({ status: 'ignored', message: 'Duplicate visit within 5 mins' });
    }

    const { error } = await supabase
      .from('page_visits')
      .insert({
        page_url,
        visitor_id,
        user_id: user_id || null,
        ip_address: ip,
        user_agent: userAgent,
      });

    if (error) {
      console.error('Supabase error tracking visit:', error);
      return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('API Error in track-visit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
