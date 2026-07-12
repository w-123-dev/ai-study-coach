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

/** 教练模式中文标签 */
export const COACH_MODE_LABELS: Record<CoachMode, string> = {
  strict: "严格监督型",
  gentle: "温和陪伴型",
  analytic: "数据分析型",
  sprint: "冲刺强化型",
};

/** 教练模式描述（用于 AI Prompt） */
export const COACH_MODE_DESCRIPTIONS: Record<CoachMode, string> = {
  strict: "你是严格监督型教练。要求严格，目标明确，督促用户完成任务。",
  gentle: "你是温和陪伴型教练。鼓励为主，理解用户情绪，缓慢推进。",
  analytic: "你是数据分析型教练。用数据说话，分析学习效率，给出最优策略。",
  sprint: "你是冲刺强化型教练。高强度训练，极限提分，争分夺秒。",
};

/** 教练配置 */
export interface CoachConfig {
  mode: CoachMode;
  autoAdjusted: boolean;
  lastAdjustReason: string;
  updatedAt: string;
}


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


/** 记忆提取结果 */
export interface MemoryExtraction {
  memories: {
    category: MemoryCategory;
    content: string;
    confidence: number;
  }[];
  stateChange: {
    detected: boolean;
    description: string;
  };
}

/** 用户画像摘要（给 AI 使用） */
export interface UserProfileSummary {
  target: string;
  level: string;
  weakSubjects: string[];
  habits: string[];
  personality: string[];
  recentMood: string;
  streak: number;
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
