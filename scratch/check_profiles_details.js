const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co';
const supabaseKey = 'sb_secret_eQP_Sky2KcMVyNxJo0GMmg_2y3XcCxj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email'); // Note: email might not be in profiles table but we can check what's there

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Profiles:', JSON.stringify(data, null, 2));
    }
}

checkProfiles();
