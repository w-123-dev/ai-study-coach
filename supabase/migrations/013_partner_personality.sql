-- AI考研教练 伙伴人格系统
-- 让伙伴拥有固定性格和记忆

-- 伙伴记忆表
-- 记录伙伴"记得"的用户信息
CREATE TABLE IF NOT EXISTS partner_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,               -- feeling | subject | habit | event | preference
  content TEXT NOT NULL,                -- 记忆内容
  source TEXT,                          -- 来源（用户说的话）
  importance INTEGER NOT NULL DEFAULT 1, -- 1-5
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_recalled_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ               -- 过期后自动清理
);

CREATE INDEX idx_partner_memories_user ON partner_memories(user_id);
CREATE INDEX idx_partner_memories_category ON partner_memories(category);

ALTER TABLE partner_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own partner memories"
  ON partner_memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own partner memories"
  ON partner_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own partner memories"
  ON partner_memories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users can delete own partner memories"
  ON partner_memories FOR DELETE
  USING (auth.uid() = user_id);
