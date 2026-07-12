import { createClient } from "@supabase/supabase-js";

const url = "https://umnqhefdlotcgofmfgrf.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnFoZWZkbG90Y2dvZm1mZ3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczODg3NCwiZXhwIjoyMDk5MzE0ODc0fQ.cBZo2nM2R-mPZSeus_SYjI-aehGztwBHnp-M_Do__fE";

const client = createClient(url, key, { auth: { persistSession: false } });

async function check() {
  const checks = ["student_profiles","user_memories","session_summaries","daily_snapshots","plan_tasks","reminders"];
  for (const name of checks) {
    try {
      const { data, error } = await client.from(name).select("*").limit(0);
      if (error) console.log("  MISSING " + name + ": " + error.message);
      else console.log("  EXISTS  " + name);
    } catch(e) { console.log("  ERROR " + name + ": " + e.message); }
  }
}
check();
