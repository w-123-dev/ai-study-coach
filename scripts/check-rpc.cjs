const { createClient } = require("@supabase/supabase-js");
const url = "https://umnqhefdlotcgofmfgrf.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnFoZWZkbG90Y2dvZm1mZ3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczODg3NCwiZXhwIjoyMDk5MzE0ODc0fQ.cBZo2nM2R-mPZSeus_SYjI-aehGztwBHnp-M_Do__fE";
const c = createClient(url, key, { auth: { persistSession: false } });
(async () => {
  try {
    const { error } = await c.rpc("exec_sql", { query_text: "SELECT 1" });
    console.log("RPC error:", error ? error.message : "FUNCTION EXISTS");
  } catch(e) {
    console.log("Exception:", e.message);
  }
  // Try alternative function name
  try {
    const { error } = await c.rpc("exec", { query: "SELECT 1" });
    console.log("exec error:", error ? error.message : "FUNCTION EXISTS");
  } catch(e) {
    console.log("exec exception:", e.message);
  }
})();
