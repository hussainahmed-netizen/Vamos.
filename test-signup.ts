import { createClient } from '@supabase/supabase-js';
const rawUrl = 'https://mrxxfacildokkfqnwjtq.supabase.co';
const supabaseAnonKey = 'sb_publishable_0elBbeYoPknXLoQsehrMAg_MYK_sy8T';
const supabase = createClient(rawUrl, supabaseAnonKey);

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'hussainahmed197125@gmail.com',
    password: 'Hussain@#1690',
  });
  console.log('Error:', error?.message);
}
testSignup();
