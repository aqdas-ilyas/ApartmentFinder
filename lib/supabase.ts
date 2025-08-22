import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Validate environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: EXPO_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable URL-based session detection for React Native
    flowType: 'implicit', // Use implicit flow for mobile apps
  },
});

// Optional: Log client initialization for debugging
console.log('Supabase client initialized with URL:', supabaseUrl);
