import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase.types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Provide placeholder values if not configured
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl === 'your_supabase_project_url_here' ||
      supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.warn('Supabase is not configured. Please update .env.local with your Supabase credentials.');
    // Return a mock client to prevent build errors
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}