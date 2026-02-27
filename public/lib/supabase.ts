import { createClient } from '@supabase/supabase-js';

// ✅ Read ENV variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Debug: check if loaded
console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseKey);

// ✅ Validation
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase ENV missing:", { supabaseUrl, supabaseKey });
  throw new Error('Missing Supabase environment variables.');
}

// ✅ Create client
export const supabase = createClient(supabaseUrl, supabaseKey);