import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!isValidUrl(supabaseUrl)) {
  console.warn('Supabase URL is missing or invalid. Please check your .env file.');
}

// We only initialize if we have a valid URL to avoid crashing the whole app
export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Type cast to any to avoid issues, we'll check for it in the app
