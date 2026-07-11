-- AI 考研教练 V2.0 Phase 2 — 打卡系统升级
-- 新增：情绪/精力追踪、逐任务记录

-- ============================================================
-- 1. daily_snapshots 增加情绪/精力字段
-- ============================================================
ALTER TABLE daily_snapshots
  ADD COLUMN IF NOT EXISTS emotion text CHECK (emotion IN ('happy', 'normal', 'anxious', 'tired')),
  ADD COLUMN IF NOT EXISTS energy text CHECK (energy IN ('high', 'medium', 'low')),
  ADD COLUMN IF NOT EXISTS memo text;

-- ============================================================
-- 2. plan_tasks 增加完成时间字段
-- ============================================================
ALTER TABLE plan_tasks
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;
