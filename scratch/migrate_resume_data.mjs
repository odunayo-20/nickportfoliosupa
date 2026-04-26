import { createAdminClient } from './lib/admin.js';

async function migrateResumeData() {
    console.log('Starting migration...');
    const supabase = createAdminClient();

    // 1. Fetch all profiles
    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, social_links, resume_url, resume_name');

    if (fetchError) {
        console.error('Error fetching profiles:', fetchError);
        return;
    }

    console.log(`Found ${profiles.length} profiles.`);

    for (const profile of profiles) {
        const sl = profile.social_links;
        if (!sl || typeof sl !== 'object') continue;

        const updates: any = {};
        let needsUpdate = false;

        // Move resume_url if column is null
        if (!profile.resume_url && sl.resume_url) {
            updates.resume_url = sl.resume_url;
            needsUpdate = true;
        }

        // Move resume_name if column is null
        if (!profile.resume_name && sl.resume_name) {
            updates.resume_name = sl.resume_name;
            needsUpdate = true;
        }

        if (needsUpdate) {
            console.log(`Migrating data for profile ${profile.id}...`);
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', profile.id);

            if (updateError) {
                console.error(`Error updating profile ${profile.id}:`, updateError);
            } else {
                console.log(`Successfully migrated profile ${profile.id}.`);
            }
        }
    }

    console.log('Migration complete.');
}

migrateResumeData();
