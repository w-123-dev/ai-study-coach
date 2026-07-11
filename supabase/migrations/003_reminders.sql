-- AI 考研教练 V2.0 — 提醒/通知系统
-- 请在 Supabase SQL Editor 中执行

-- ============================================================
-- reminders — AI 主动提醒和通知
-- ============================================================
create table if not exists reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  message text not null,
  type text not null default 'notification',
  status text not null default 'pending' check (status in ('pending', 'sent', 'dismissed')),
  created_at timestamptz default now(),
  sent_at timestamptz
);

create index if not exists idx_reminders_user_status on reminders(user_id, status);

-- ============================================================
-- 行级安全策略
-- ============================================================
alter table reminders enable row level security;

create policy "Users can view own reminders"
  on reminders for select using (auth.uid() = user_id);
create policy "Users can insert own reminders"
  on reminders for insert with check (auth.uid() = user_id);
create policy "Users can update own reminders"
  on reminders for update using (auth.uid() = user_id);
create policy "Users can delete own reminders"
  on reminders for delete using (auth.uid() = user_id);
