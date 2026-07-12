// ===== 学习伙伴系统类型 =====
// 纯陪伴设计，不包含游戏化元素

/** 伙伴状态 */
export type PartnerState = "calm" | "studying" | "happy" | "resting";

/** 伙伴状态中文映射 */
export const PARTNER_STATE_LABELS: Record<PartnerState, string> = {
  calm: "平静",
  studying: "学习中",
  happy: "开心",
  resting: "休息中",
};

/** 伙伴状态图标（用于显示） */
export const PARTNER_STATE_ICON: Record<PartnerState, string> = {
  calm: "◎",
  studying: "○",
  happy: "◕",
  resting: "◡",
};

/** 可用皮肤 */
export type PartnerSkin = "default" | "ocean" | "forest" | "galaxy";

/** 皮肤配置 */
export interface SkinConfig {
  name: string;
  description: string;
  primaryColor: string;
  bgColor: string;
  glowColor: string;
}

export const SKIN_CONFIGS: Record<PartnerSkin, SkinConfig> = {
  default: {
    name: "星辉",
    description: "经典星光",
    primaryColor: "#60A5FA",
    bgColor: "#1E293B",
    glowColor: "rgba(96,165,250,0.3)",
  },
  ocean: {
    name: "深海",
    description: "宁静深海",
    primaryColor: "#2DD4BF",
    bgColor: "#0F2D2A",
    glowColor: "rgba(45,212,191,0.3)",
  },
  forest: {
    name: "森林",
    description: "自然清新",
    primaryColor: "#4ADE80",
    bgColor: "#1A2E1A",
    glowColor: "rgba(74,222,128,0.3)",
  },
  galaxy: {
    name: "星云",
    description: "梦幻星云",
    primaryColor: "#A78BFA",
    bgColor: "#1E1A2E",
    glowColor: "rgba(167,139,250,0.3)",
  },
};

/** 伙伴数据 */
export interface UserPartner {
  id: string;
  user_id: string;
  name: string;
  state: PartnerState;
  energy: number;
  skin: PartnerSkin;
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
  partner_state_before: string | null;
  partner_state_after: string | null;
  started_at: string;
  completed_at: string | null;
}
