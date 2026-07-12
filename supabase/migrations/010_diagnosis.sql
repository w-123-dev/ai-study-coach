-- AI 考研教练 V2.0 — 考研诊断系统迁移
-- 请在 Supabase SQL Editor 中执行

-- ============================================================
-- 1. 在 student_profiles 中添加 diagnosis 字段
-- ============================================================
alter table student_profiles
  add column if not exists diagnosis jsonb default null;

comment on column student_profiles.diagnosis is 'AI 考研诊断结果，包含用户画像、优势、风险、建议等';
