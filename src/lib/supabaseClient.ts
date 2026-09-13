import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hybjgacapumzfstenkxr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YmpnYWNhcHVtemZzdGVua3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MTk4MDgsImV4cCI6MjEwMjI5NTgwOH0.Wmy0g1QXob_BNvzTtzozcz_GdQ8ah6-O4xZFf4Vjxd0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

