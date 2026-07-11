-- AI 考研教练 V2.0 — 计划任务追踪系统
-- 请在 Supabase SQL Editor 中执行

-- ============================================================
-- plan_tasks — 独立的任务追踪表
-- 替代原有的 study_tasks 临时表
-- ============================================================
create table if not exists plan_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_number int not null,
  subject text not null,
  content text not null,
  planned_hours numeric(4,1) not null,
  actual_hours numeric(4,1) default 0,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'delayed')),
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  difficulty int default 3
    check (difficulty between 1 and 5),
  delay_count int default 0,
  period text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_plan_tasks_user_week
  on plan_tasks(user_id, week_number);
create index if not exists idx_plan_tasks_user_status
  on plan_tasks(user_id, status);

-- ============================================================
-- 行级安全策略
-- ============================================================
alter table plan_tasks enable row level security;

create policy "Users can view own plan tasks"
  on plan_tasks for select using (auth.uid() = user_id);
create policy "Users can insert own plan tasks"
  on plan_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own plan tasks"
  on plan_tasks for update using (auth.uid() = user_id);
create policy "Users can delete own plan tasks"
  on plan_tasks for delete using (auth.uid() = user_id);
