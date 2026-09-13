import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) 
  ? rawUrl 
  : 'https://hybjgacapumzfstenkxr.supabase.co';

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseAnonKey = (rawKey && rawKey !== '[SENSITIVE]' && rawKey.length > 20)
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YmpnYWNhcHVtemZzdGVua3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MTk4MDgsImV4cCI6MjEwMjI5NTgwOH0.Wmy0g1QXob_BNvzTtzozcz_GdQ8ah6-O4xZFf4Vjxd0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

