-- AI考研教练 伙伴短期关怀记忆
-- 伙伴记住昨天用户最后说过的话，今天优先问候

ALTER TABLE user_partner
  ADD COLUMN IF NOT EXISTS last_user_message TEXT,
  ADD COLUMN IF NOT EXISTS last_message_date DATE;
