const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co';
const supabaseKey = 'sb_secret_eQP_Sky2KcMVyNxJo0GMmg_2y3XcCxj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResumeUrl() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, resume_url')
        .limit(1)
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Current profile resume_url:', data.resume_url);
        console.log('Profile ID:', data.id);
    }
}

checkResumeUrl();
