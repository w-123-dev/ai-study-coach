// 一键执行 Supabase 数据库迁移
// 使用 service_role key 通过 REST API 运行 SQL

const https = require("https");
const PROJECT_REF = "umnqhefdlotcgofmfgrf";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbnFoZWZkbG90Y2dvZm1mZ3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczODg3NCwiZXhwIjoyMDk5MzE0ODc0fQ.cBZo2nM2R-mPZSeus_SYjI-aehGztwBHnp-M_Do__fE";

const SQL = `
CREATE TABLE IF NOT EXISTS plan_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  week_number INT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  planned_hours NUMERIC(4,1) NOT NULL,
  actual_hours NUMERIC(4,1) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low')),
  difficulty INT DEFAULT 3
    CHECK (difficulty BETWEEN 1 AND 5),
  delay_count INT DEFAULT 0,
  PERIOD TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_tasks_user_week
  ON plan_tasks(user_id, week_number);
CREATE INDEX IF NOT EXISTS idx_plan_tasks_user_status
  ON plan_tasks(user_id, status);

ALTER TABLE plan_tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_tasks' AND policyname = 'Users can view own plan tasks') THEN
    CREATE POLICY "Users can view own plan tasks"
      ON plan_tasks FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own plan tasks"
      ON plan_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own plan tasks"
      ON plan_tasks FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete own plan tasks"
      ON plan_tasks FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
`;

async function tryManagementAPI() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: SQL });
    const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/sql`;
    const req = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => body += c);
      res.on("end", () => {
        console.log(`[Management API] ${res.statusCode}`);
        if (res.statusCode < 300) resolve(true);
        else reject(new Error(`${res.statusCode}: ${body.slice(0, 300)}`));
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function trySQLRPC() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: SQL });
    const url = `https://${PROJECT_REF}.supabase.co/sql`;
    const req = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        apiKey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => body += c);
      res.on("end", () => {
        console.log(`[SQL Endpoint] ${res.statusCode}`);
        if (res.statusCode < 300) resolve(true);
        else reject(new Error(`${res.statusCode}: ${body.slice(0, 300)}`));
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("正在执行数据库迁移...\n");

  // 方法1：Management API
  try {
    console.log("尝试 Management API...");
    await tryManagementAPI();
    console.log("\u2713 迁移完成！");
    return;
  } catch (e) {
    console.log("  ->", e.message.slice(0, 100));
  }

  // 方法2：SQL Endpoint
  try {
    console.log("尝试 SQL Endpoint...");
    await trySQLRPC();
    console.log("\u2713 迁移完成！");
    return;
  } catch (e) {
    console.log("  ->", e.message.slice(0, 100));
  }

  // 两种方法都失败
  console.log("\n两种自动方法都失败了。请在 Supabase Dashboard 手动执行 SQL。");
  console.log("打开: https://app.supabase.com/project/umnqhefdlotcgofmfgrf/sql/new");
  console.log("复制粘贴以下 SQL 并执行:\n");
  console.log(SQL);
}

main().catch(console.error);
