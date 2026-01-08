import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project credentials
// You can find these in your Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);