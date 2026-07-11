-- AI 考研教练 V2.0 — 记忆系统数据库迁移
-- 请在 Supabase SQL Editor 中执行

-- ============================================================
-- 1. user_memories — AI 长期记忆
-- ============================================================
create table if not exists user_memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category text not null check (category in (
    'goal', 'habit', 'weakness', 'strength', 'personality', 'preference', 'concern', 'progress'
  )),
  content text not null,
  confidence int default 5 check (confidence between 1 and 10),
  source text not null default 'chat',
  context_snapshot jsonb default '{}',
  last_reinforced_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_memories_user_category on user_memories(user_id, category);
create index if not exists idx_memories_user_recent on user_memories(user_id, last_reinforced_at desc);

-- ============================================================
-- 2. session_summaries — 对话摘要
-- ============================================================
create table if not exists session_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  session_start timestamptz not null,
  session_end timestamptz,
  session_type text not null default 'chat',
  key_topics text[] default '{}',
  user_concerns text[] default '{}',
  ai_suggestions text[] default '{}',
  follow_up_asked boolean default false,
  mood text check (mood in ('positive', 'neutral', 'negative', 'frustrated')),
  message_count int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_summaries_user on session_summaries(user_id, session_start desc);

-- ============================================================
-- 3. daily_snapshots — 每日快照
-- ============================================================
create table if not exists daily_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  total_hours numeric(4,1) default 0,
  completion_rate int default 0,
  energy_level int check (energy_level between 1 and 5),
  difficulties text[] default '{}',
  subject_hours jsonb default '{}',
  subject_completion jsonb default '{}',
  emotion_trend text check (emotion_trend in ('up', 'down', 'stable')),
  ai_summary text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create index if not exists idx_snapshots_user_date on daily_snapshots(user_id, date desc);

-- ============================================================
-- 4. 行级安全策略（RLS）
-- ============================================================
alter table user_memories enable row level security;
alter table session_summaries enable row level security;
alter table daily_snapshots enable row level security;

-- 用户只能看到自己的数据
create policy "Users can view own memories"
  on user_memories for select using (auth.uid() = user_id);
create policy "Users can insert own memories"
  on user_memories for insert with check (auth.uid() = user_id);
create policy "Users can update own memories"
  on user_memories for update using (auth.uid() = user_id);
create policy "Users can delete own memories"
  on user_memories for delete using (auth.uid() = user_id);

create policy "Users can view own session summaries"
  on session_summaries for select using (auth.uid() = user_id);
create policy "Users can insert own session summaries"
  on session_summaries for insert with check (auth.uid() = user_id);
create policy "Users can update own session summaries"
  on session_summaries for update using (auth.uid() = user_id);

create policy "Users can view own daily snapshots"
  on daily_snapshots for select using (auth.uid() = user_id);
create policy "Users can insert own daily snapshots"
  on daily_snapshots for insert with check (auth.uid() = user_id);
create policy "Users can update own daily snapshots"
  on daily_snapshots for update using (auth.uid() = user_id);

-- service_role 跳过 RLS（用于后端服务操作）
