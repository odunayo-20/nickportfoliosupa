const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfile() {
    console.log('Checking profiles table...');
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log('Profiles found:', data.length);
        if (data.length > 0) {
            console.log('First profile columns:', Object.keys(data[0]));
            console.log('First profile data:', JSON.stringify(data[0], null, 2));
        }
    }
}

checkProfile();
