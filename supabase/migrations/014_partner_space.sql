-- AI考研教练 伙伴学习空间
-- 不是游戏房间，是用户学习后逐渐有生活痕迹的学习角
-- 变化非常慢，没有"获得奖励"的表达

CREATE TABLE IF NOT EXISTS partner_space (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_count INTEGER NOT NULL DEFAULT 0,
  coffee_count INTEGER NOT NULL DEFAULT 0,
  plant_stage INTEGER NOT NULL DEFAULT 0,
  note_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE partner_space ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own space"
  ON partner_space FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own space"
  ON partner_space FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own space"
  ON partner_space FOR UPDATE
  USING (auth.uid() = user_id);
