import { createClient } from '@supabase/supabase-js';

const url = 'https://umnqhefdlotcgofmfgrf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnFoZWZkbG90Y2dvZm1mZ3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczODg3NCwiZXhwIjoyMDk5MzE0ODc0fQ.cBZo2nM2R-mPZSeus_SYjI-aehGztwBHnp-M_Do__fE';
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Try to create exec_sql function by using .from() to insert into pg_proc
// Actually, let's try to use the sql() method from postgrest-js
// Supabase v2 has a .sql() method via the postgrest client
async function run() {
  try {
    // @supabase/supabase-js v2.110+ has .sql() on the postgrest client
    const { data, error } = await supabase.rpc('extensions.pgcron');
    console.log('pgcron:', error?.message || 'ok');
  } catch(e) { console.log('pgcron err:', e.message); }
  
  // Try supabase.rest or supabase.query
  console.log('supabase methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(supabase)).join(', '));
  console.log('rpc methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(supabase.rpc)).join(', '));
}
run();
