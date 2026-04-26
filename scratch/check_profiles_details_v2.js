const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co';
const supabaseKey = 'sb_secret_eQP_Sky2KcMVyNxJo0GMmg_2y3XcCxj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Profiles:', JSON.stringify(data, null, 2));
    }
}

checkProfiles();
