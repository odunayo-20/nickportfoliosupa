const { createClient } = require('@supabase/supabase-js');

// Values from .env.local
const supabaseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co';
const supabaseKey = 'sb_secret_eQP_Sky2KcMVyNxJo0GMmg_2y3XcCxj';

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
            // console.log('First profile data:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('No profiles found in the table.');
        }
    }
}

checkProfile();
