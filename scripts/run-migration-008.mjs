import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const SQL = readFileSync("supabase/migrations/008_coach_messages.sql", "utf8");

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnFoZWZkbG90Y2dvZm1mZ3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczODg3NCwiZXhwIjoyMDk5MzE0ODc0fQ.cBZo2nM2R-mPZSeus_SYjI-aehGztwBHnp-M_Do__fE";

async function run() {
  // Try Supabase SQL endpoint
  const endpoints = [
    "https://umnqhefdlotcgofmfgrf.supabase.co/sql",
    "https://api.supabase.com/v1/projects/umnqhefdlotcgofmfgrf/database/query",
  ];

  for (const url of endpoints) {
    console.log("Trying:", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SERVICE_KEY,
          "Authorization": "Bearer " + SERVICE_KEY,
        },
        body: JSON.stringify({ query: SQL }),
      });
      const text = await res.text();
      console.log("Status:", res.status, "Response:", text.substring(0, 200));
      if (res.ok) {
        console.log("Migration successful!");
        return;
      }
    } catch (e) {
      console.log("Failed:", e.message);
    }
  }

  console.log("\nCould not run migration automatically.");
  console.log("Please run this SQL in Supabase SQL Editor:");
  console.log("---");
  console.log(SQL.substring(0, 500) + "...");
}

run().catch(console.error);
