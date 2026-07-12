-- AI 考研教练 V2.0 — AI主动教练消息系统
-- AI不再等待用户提问，主动发现学习问题并生成教练消息

-- ============================================================
-- 1. 创建 coach_messages 表
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 消息类型
  type text NOT NULL CHECK (
    type IN (
      'no_study',           -- 连续未学习
      'completion_drop',    -- 完成率下降
      'subject_stagnation', -- 某科停滞
      'anxiety',           -- 长期焦虑
      'adjustment',        -- 计划调整建议
      'encouragement',     -- 主动鼓励
      'general'            -- 通用提醒
    )
  ),

  -- 消息标题（如："数学进度停滞提醒"）
  title text NOT NULL DEFAULT '',

  -- AI 生成的消息正文
  message text NOT NULL DEFAULT '',

  -- 关联的科目（可为空）
  related_subject text,

  -- 严重程度
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),

  -- 状态
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed')),

  -- 检测依据的快照数据（JSON，用于调试和展示）
  detection_data jsonb DEFAULT '{}',

  -- 元数据
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- 索引：按用户和状态查询
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_status
  ON coach_messages (user_id, status, created_at DESC);

-- 索引：按用户和类型查询
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_type
  ON coach_messages (user_id, type);

-- ============================================================
-- 2. 清理旧消息（保留最近 30 天）
-- ============================================================
CREATE OR REPLACE FUNCTION clean_old_coach_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM coach_messages
  WHERE created_at < now() - interval '30 days';
END;
$$;

-- ============================================================
-- 3. 启用 RLS
-- ============================================================
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own coach messages"
  ON coach_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own coach messages"
  ON coach_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own coach messages"
  ON coach_messages FOR UPDATE
  USING (auth.uid() = user_id);
