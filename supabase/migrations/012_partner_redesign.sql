-- AI考研教练 学习伙伴系统
-- 纯陪伴层，不包含游戏化元素（无经验值、等级、成长值）

-- 伙伴表
CREATE TABLE IF NOT EXISTS user_partner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '小伴',
  state TEXT NOT NULL DEFAULT 'calm',           -- calm | studying | happy | resting
  energy INTEGER NOT NULL DEFAULT 80,           -- 0-100
  skin TEXT NOT NULL DEFAULT 'default',          -- default | ocean | forest | galaxy
  last_interaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 专注记录表
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  partner_state_before TEXT,
  partner_state_after TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE user_partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own partner"
  ON user_partner FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own partner"
  ON user_partner FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own partner"
  ON user_partner FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users can read own focus sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own focus sessions"
  ON focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);
