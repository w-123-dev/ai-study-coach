-- AI 考研教练 V2.0 Phase 3b — 学生状态分析系统
-- 每日自动计算用户当前学习状态

-- ============================================================
-- 1. 创建 student_states 表
-- ============================================================
CREATE TABLE IF NOT EXISTS student_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 学习动力
  motivation text CHECK (motivation IN ('high', 'medium', 'low')),
  
  -- 完成趋势
  completion_trend text CHECK (completion_trend IN ('rising', 'stable', 'declining')),
  
  -- 风险等级
  risk_level text CHECK (risk_level IN ('low', 'medium', 'high')),
  
  -- 薄弱科目
  weak_subjects text[] DEFAULT '{}',
  
  -- 压力状态
  stress_level text CHECK (stress_level IN ('low', 'normal', 'high')),
  
  -- 数值统计（用于 AI 分析）
  avg_daily_hours real DEFAULT 0,
  avg_completion_rate real DEFAULT 0,
  streak_days integer DEFAULT 0,
  delay_count integer DEFAULT 0,
  total_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  
  -- 元数据
  risk_reasons text[] DEFAULT '{}',
  suggestions text[] DEFAULT '{}',
  analyzed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 唯一约束：每天每个用户一条
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_states_user
  ON student_states (user_id);

-- ============================================================
-- 2. 启用 RLS
-- ============================================================
ALTER TABLE student_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own state"
  ON student_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own state"
  ON student_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own state"
  ON student_states FOR UPDATE
  USING (auth.uid() = user_id);
