// ===== 伙伴系统类型 =====

/** 伙伴情绪 */
export type PartnerMood = "calm" | "focused" | "happy" | "sleepy";

/** 伙伴情绪中文映射 */
export const PARTNER_MOOD_LABELS: Record<PartnerMood, string> = {
  calm: "平静",
  focused: "专注",
  happy: "开心",
  sleepy: "困了",
};

/** 伙伴情绪 emoji */
export const PARTNER_MOOD_EMOJI: Record<PartnerMood, string> = {
  calm: "😊",
  focused: "😌",
  happy: "😄",
  sleepy: "😴",
};

/** 伙伴数据 */
export interface UserPartner {
  id: string;
  user_id: string;
  name: string;
  level: number;
  exp: number;
  connection: number;
  mood: PartnerMood;
  energy: number;
  total_focus_minutes: number;
  total_study_days: number;
  longest_streak: number;
  current_streak: number;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
}

/** 专注记录 */
export interface FocusSession {
  id: string;
  user_id: string;
  duration_minutes: number;
  completed: boolean;
  partner_mood_before: string | null;
  partner_mood_after: string | null;
  started_at: string;
  completed_at: string | null;
}

/** 经验值等级配置 */
export const LEVEL_THRESHOLDS = [
  0,      // Lv.1
  100,    // Lv.2
  250,    // Lv.3
  500,    // Lv.4
  800,    // Lv.5
  1200,   // Lv.6
  1700,   // Lv.7
  2300,   // Lv.8
  3000,   // Lv.9
  4000,   // Lv.10
];

/** 计算等级 */
export function calculateLevel(exp: number): { level: number; currentExp: number; nextThreshold: number } {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000;
  return { level, currentExp: exp - currentThreshold, nextThreshold: nextThreshold - currentThreshold };
}
