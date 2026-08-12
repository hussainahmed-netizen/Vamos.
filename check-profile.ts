import { createClient } from '@supabase/supabase-js';
const rawUrl = 'https://mrxxfacildokkfqnwjtq.supabase.co';
const supabaseAnonKey = 'sb_publishable_0elBbeYoPknXLoQsehrMAg_MYK_sy8T';
const supabase = createClient(rawUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', 'hussainahmed197125@gmail.com');
  console.log('Profile:', data, error);
}
check();
