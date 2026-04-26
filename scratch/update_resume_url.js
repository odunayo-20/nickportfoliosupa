const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co';
const supabaseKey = 'sb_secret_eQP_Sky2KcMVyNxJo0GMmg_2y3XcCxj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateResumeUrl() {
    const profileId = '2d1f5c49-dc0f-4a49-ae55-247523129a22';
    const baseUrl = 'https://ycdylfacmyxghfilhakq.supabase.co/storage/v1/object/public/media/81f84976-c402-4670-ad8b-8c9489ea52e9/sbix47ka1e.pdf';
    const downloadUrl = `${baseUrl}?download=`;

    console.log(`Updating profile ${profileId} resume_url to: ${downloadUrl}`);

    const { data, error } = await supabase
        .from('profiles')
        .update({ resume_url: downloadUrl })
        .eq('id', profileId)
        .select();

    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Successfully updated profile:', data[0].resume_url);
    }
}

updateResumeUrl();
