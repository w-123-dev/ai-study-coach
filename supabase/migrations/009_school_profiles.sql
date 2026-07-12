-- 院校专业信息库
-- 用途：存储真实考研院校数据，供 AI 生成计划时参考
-- 原则：宁缺毋滥，只存已验证或有可靠来源的数据

CREATE TABLE IF NOT EXISTS school_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school VARCHAR(255) NOT NULL,
  major VARCHAR(255) NOT NULL,
  exam_year INTEGER,                     -- 数据对应年份
  exam_subjects TEXT[],                  -- 初试科目列表
  exam_subject_codes VARCHAR(100)[],     -- 科目代码
  cutoff_score INTEGER,                  -- 复试分数线
  avg_admission_score INTEGER,           -- 录取平均分
  competition_ratio VARCHAR(50),         -- 报录比，如 "10:1"
  enrollment_quota INTEGER,              -- 拟招生人数
  school_tier VARCHAR(50),               -- 学校层次：985/211/双一流/普通
  major_ranking VARCHAR(100),            -- 学科评估等级：A+/A/B+ 等
  notes TEXT,                            -- 补充说明
  data_source VARCHAR(255),              -- 数据来源
  verified BOOLEAN DEFAULT false,        -- 是否已核实
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_school_profiles_school ON school_profiles(school);
CREATE INDEX IF NOT EXISTS idx_school_profiles_major ON school_profiles(major);
CREATE INDEX IF NOT EXISTS idx_school_profiles_school_major ON school_profiles(school, major);

-- RLS
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;

-- 所有用户可读
CREATE POLICY "anyone can read school profiles"
  ON school_profiles FOR SELECT
  USING (true);

-- 仅服务端可写
CREATE POLICY "service role can insert school profiles"
  ON school_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "service role can update school profiles"
  ON school_profiles FOR UPDATE
  USING (true);
