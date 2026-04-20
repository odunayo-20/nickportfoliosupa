import { createClient } from '@supabase/supabase-js';

const url = 'https://ycdylfacmyxghfilhakq.supabase.co';
const key = 'sb_publishable_z5lewDa4_y41nHypvLAo-Q_bOdm1QKl';

const supabase = createClient(url, key);

async function check() {
    const { data: row } = await supabase.from('settings').select('id').limit(1).maybeSingle();
    if (!row?.id) { console.log("No settings row"); return; }

    const fullPayload = {
        site_title: 'Nikola Portfolio',
        site_tagline: 'Design-led software engineering',
        portfolio_url: '',
        meta_description: 'Test description',
        keywords: ['test'],
        theme_mode: 'light',
        accent_color: 'rose-500',
        logo: 'https://ycdylfacmyxghfilhakq.supabase.co/storage/v1/object/public/media/rcii0o11gsi.png',
        og_image_url: 'https://ycdylfacmyxghfilhakq.supabase.co/storage/v1/object/public/media/rcii0o11gsi.png',
        notifications: { email_inquiries: true, blog_comments: false, analytics_digest: true },
        security: { two_factor: true, ip_whitelist: false },
        updated_at: new Date().toISOString(),
    };

    // Simulate the new updateSettings logic (update, not upsert)
    console.log("Simulating new updateSettings (plain UPDATE)...");
    const { error } = await supabase.from('settings').update(fullPayload).eq('id', row.id);

    if (error) {
        console.error("❌ Still failing:", error.message);
    } else {
        console.log("✅ Success! Settings saved with logo URL correctly.");
    }

    // Revert
    await supabase.from('settings').update({ logo: null, og_image_url: '' }).eq('id', row.id);
    console.log("(reverted test values)");
}
check();
