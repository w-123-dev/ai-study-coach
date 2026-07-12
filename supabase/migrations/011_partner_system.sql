-- AI考研教练 伙伴系统
-- 陪伴层，不是游戏或宠物

CREATE TABLE IF NOT EXISTS user_partner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '小伴',
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  connection INTEGER NOT NULL DEFAULT 0,       -- 亲密度 0-100
  mood TEXT NOT NULL DEFAULT 'calm',            -- calm | focused | happy | sleepy
  energy INTEGER NOT NULL DEFAULT 80,           -- 0-100
  total_focus_minutes INTEGER NOT NULL DEFAULT 0,
  total_study_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_interaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  partner_mood_before TEXT,
  partner_mood_after TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 设置 RLS
ALTER TABLE user_partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- 用户只能读写自己的伙伴
CREATE POLICY "users can read own partner"
  ON user_partner FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own partner"
  ON user_partner FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own partner"
  ON user_partner FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能读写自己的专注记录
CREATE POLICY "users can read own focus sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own focus sessions"
  ON focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);
