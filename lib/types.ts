// ===== 原始 V1 类型（保持不变） =====

export interface StudentProfile {
  id: string;
  user_id: string;
  exam_year: number;
  school: string;
  major: string;
  subjects: string[];
  level: string;
  daily_hours: number;
  weak_subjects: string[];
  study_plan: StudyPlan | null;
  created_at: string;
  updated_at: string;
}

export interface StudyPlanStage {
  name: string;
  period: string;
  weeks: number;
  goal: string;
  focus: string;
}

export interface WeeklyTask {
  subject: string;
  content: string;
  hours: number;
}

export interface WeeklyPlan {
  week: number;
  period: string;
  tasks: WeeklyTask[];
}

export interface DailyRoutine {
  weekday: string;
  weekend: string;
  tips: string[];
}

export interface StudyPlan {
  stages: StudyPlanStage[];
  weekly_plan: WeeklyPlan[];
  daily_routine: DailyRoutine;
}

// ===== V2.0 新增类型 =====

/** AI 记忆分类 */
export type MemoryCategory =
  | "goal"
  | "habit"
  | "weakness"
  | "strength"
  | "personality"
  | "preference"
  | "concern"
  | "progress";

/** 教练模式 */
export type CoachMode =
  | "strict"       // 严格监督型
  | "gentle"       // 温和陪伴型
  | "analytic"     // 数据分析型
  | "sprint";      // 冲刺强化型

/** 情绪状态 */
export type Emotion = "happy" | "normal" | "anxious" | "tired";

/** 精力等级 */
export type Energy = "high" | "medium" | "low";

/** 情绪中文映射 */
export const EMOTION_LABELS: Record<Emotion, string> = {
  happy: "开心",
  normal: "正常",
  anxious: "焦虑",
  tired: "疲惫",
};

/** 精力中文映射 */
export const ENERGY_LABELS: Record<Energy, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

/** 每日快照 */
export interface DailySnapshot {
  id: string;
  user_id: string;
  date: string;
  total_hours: number;
  completion_rate: number;
  energy_level: number;
  difficulties: string[];
  subject_hours: Record<string, number>;
  subject_completion: Record<string, number>;
  emotion_trend: string;
  emotion: Emotion | null;
  energy: Energy | null;
  memo: string | null;
  ai_summary: string | null;
  created_at: string;
}

/** 会话摘要 */
export interface SessionSummary {
  id: string;
  user_id: string;
  session_start: string;
  session_end: string | null;
  session_type: string;
  key_topics: string[];
  user_concerns: string[];
  ai_suggestions: string[];
  follow_up_asked: boolean;
  mood: string | null;
  message_count: number;
  created_at: string;
}

/** 用户长期记忆 */
export interface UserMemory {
  id: string;
  user_id: string;
  category: MemoryCategory;
  content: string;
  confidence: number;
  source: string;
  context_snapshot: Record<string, unknown>;
  last_reinforced_at: string;
  expires_at: string | null;
  created_at: string;
}

/** 提醒/通知 */
export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  status: "pending" | "sent" | "dismissed";
  created_at: string;
  sent_at: string | null;
}

/** AI 教练消息 */
export interface CoachMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}


// ===== 动态计划系统 =====

/** 计划任务状态 */
export type PlanTaskStatus = "pending" | "in_progress" | "completed" | "delayed";

/** 计划任务优先级 */
export type TaskPriority = "high" | "medium" | "low";

/** 计划任务追踪 */
export interface PlanTask {
  id: string;
  user_id: string;
  week_number: number;
  subject: string;
  content: string;
  planned_hours: number;
  actual_hours: number;
  status: PlanTaskStatus;
  priority: TaskPriority;
  difficulty: number;
  delay_count: number;
  period: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
