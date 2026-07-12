-- AI考研教练 伙伴观察日志
-- 不是学习报告，而是伙伴每天记录一两句温柔观察
-- 基于用户行为自然生成

CREATE TABLE IF NOT EXISTS partner_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  log_type TEXT NOT NULL DEFAULT 'daily',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_logs_user_date ON partner_logs(user_id, log_date DESC);

ALTER TABLE partner_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own logs"
  ON partner_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own logs"
  ON partner_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
