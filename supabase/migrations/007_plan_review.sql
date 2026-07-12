-- AI 考研教练 V2.0 Phase 4 — 动态学习计划调整系统
-- 每周自动复盘 + AI 建议 + 系统验证 + 生成新任务

-- ============================================================
-- 1. plan_tasks 增加版本号（区分原始任务和调整后任务）
-- ============================================================
ALTER TABLE plan_tasks
  ADD COLUMN IF NOT EXISTS plan_version integer DEFAULT 1;

-- ============================================================
-- 2. 创建 plan_reviews 表（每周复盘记录）
-- ============================================================
CREATE TABLE IF NOT EXISTS plan_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 复盘周期
  week_number integer NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  
  -- 统计数据
  completion_rate real DEFAULT 0,
  total_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  delayed_tasks integer DEFAULT 0,
  avg_daily_hours real DEFAULT 0,
  
  -- 各科目完成情况
  subject_breakdown jsonb DEFAULT '{}',
  
  -- AI 分析结果
  analysis_summary text,
  problems_found text[] DEFAULT '{}',
  
  -- 调整建议（AI 生成，系统验证前）
  adjustment_suggestions jsonb DEFAULT '[]',
  
  -- 验证结果
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'applied')),
  validation_notes text,
  
  -- 是否已应用调整
  new_version integer,
  applied_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_plan_reviews_user_week
  ON plan_reviews (user_id, week_number DESC);

-- ============================================================
-- 3. RLS
-- ============================================================
ALTER TABLE plan_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own reviews"
  ON plan_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own reviews"
  ON plan_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own reviews"
  ON plan_reviews FOR UPDATE
  USING (auth.uid() = user_id);
