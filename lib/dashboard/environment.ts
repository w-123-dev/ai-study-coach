// AI考研教练 环境欢迎系统
// 根据时间、日期、考试倒计时等生成不同欢迎语
// 使用日期种子保证同一天内一致

// ===== 时间段 =====

export type TimePeriod = "dawn" | "morning" | "afternoon" | "evening" | "night";

export function getTimePeriod(): TimePeriod {
  const h = new Date().getHours();
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

// ===== 日期种子（用于一天内保持一致的随机选择） =====

function getDateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function seededPick<T>(arr: T[], seed: number, index: number = 0): T {
  return arr[(seed + index) % arr.length];
}

// ===== 欢迎语池 =====

// 清晨 (5:00-7:59)
const DAWN = [
  "天刚亮，你已经醒了。",
  "又是早起的一天。",
  "清晨最适合学习。",
  "一天之计在于晨。",
  "早起的人，运气不会差。",
  "安静的时间，属于努力的人。",
];

// 上午 (8:00-11:59)
const MORNING = [
  "新的一天开始了。",
  "今天状态看起来不错。",
  "准备好今天的学习了吗？",
  "上午效率最高，加油。",
  "今天也是元气满满的一天。",
  "早上的时间不要浪费哦。",
];

// 下午 (12:00-17:59)
const AFTERNOON = [
  "下午了，不要犯困。",
  "午后的阳光很适合学习。",
  "下午继续加油。",
  "坚持住，下午也能学很多。",
  "下午的时间也很宝贵。",
  "学了一上午，下午也要保持节奏。",
];

// 傍晚 (18:00-21:59)
const EVENING = [
  "天快黑了，今天收获如何？",
  "晚上的时间要好好利用。",
  "又到了夜间学习时间。",
  "学累了就休息一下。",
  "晚上的效率也可以很高。",
  "今天的努力，不会白费。",
];

// 深夜 (22:00-4:59)
const NIGHT = [
  "夜深了，注意休息。",
  "今天辛苦了。",
  "太晚了，明天再继续吧。",
  "休息也是学习的一部分。",
  "熬夜不如早起。",
  "晚安，明天继续。",
];

// ===== 特殊场景 =====

const EXAM_FAR = [
  "时间还很充裕，但每一天都很重要。",
  "备考是长跑，保持自己的节奏。",
];

const EXAM_NEAR = [
  "时间越来越近了，加油。",
  "冲刺阶段，稳住心态。",
  "全力以赴的时候到了。",
];

const EXAM_VERY_NEAR = [
  "最后冲刺，坚持就是胜利。",
  "马上就到考试了，相信自己。",
  "你已经准备了这么久，可以的。",
];

const STREAK_3 = [
  "连续三天了，不错的节奏。",
  "已经坚持三天，继续加油。",
];

const STREAK_7 = [
  "连续一周，很稳。",
  "一周了，你已经养成了习惯。",
];

const STREAK_14 = [
  "连续两周，这就是自律的样子。",
  "两周了，你已经超越很多人。",
];

const STREAK_30 = [
  "连续一个月！",
  "一个月了，坚持本身就是了不起的事。",
];

const HAS_CHECKIN = [
  "今天已经打卡了。",
  "今天的学习记录已经完成。",
];

// ===== 组合欢迎语 =====

export interface GreetingContext {
  timePeriod: TimePeriod;
  daysUntilExam: number;
  streak: number;
  hasCheckedIn: boolean;
  hasPlan: boolean;
  targetSchool?: string;
  targetMajor?: string;
}

export function generateGreeting(ctx: GreetingContext): string {
  const today = new Date().toISOString().split("T")[0];
  const seed = getDateSeed(today);

  // 时段欢迎语
  let timeGreeting: string;
  switch (ctx.timePeriod) {
    case "dawn":
      timeGreeting = seededPick(DAWN, seed, 0);
      break;
    case "morning":
      timeGreeting = seededPick(MORNING, seed, 0);
      break;
    case "afternoon":
      timeGreeting = seededPick(AFTERNOON, seed, 0);
      break;
    case "evening":
      timeGreeting = seededPick(EVENING, seed, 0);
      break;
    case "night":
      timeGreeting = seededPick(NIGHT, seed, 0);
      break;
  }

  // 晚上了，直接返回时段问候（不要额外信息）
  if (ctx.timePeriod === "night") {
    return timeGreeting;
  }

  // 特殊场景 — 考试临近优先
  if (ctx.daysUntilExam <= 7) {
    return seededPick(EXAM_VERY_NEAR, seed, 1);
  }
  if (ctx.daysUntilExam <= 30) {
    return seededPick(EXAM_NEAR, seed, 1);
  }
  if (ctx.daysUntilExam <= 90) {
    return seededPick(EXAM_NEAR, seed, 2);
  }

  // 连续打卡激励
  if (ctx.streak >= 30) {
    return seededPick(STREAK_30, seed, 2);
  }
  if (ctx.streak >= 14) {
    return seededPick(STREAK_14, seed, 2);
  }
  if (ctx.streak >= 7) {
    return seededPick(STREAK_7, seed, 2);
  }
  if (ctx.streak >= 3) {
    return seededPick(STREAK_3, seed, 2);
  }

  // 已经打卡
  if (ctx.hasCheckedIn) {
    return seededPick(HAS_CHECKIN, seed, 3);
  }

  // 普通时段问候
  return timeGreeting;
}

// ===== 标题问候语 =====
// 简短，如"早上好""下午好"

export function getSimpleGreeting(): string {
  const period = getTimePeriod();
  switch (period) {
    case "dawn":
    case "morning":
      return "早上好";
    case "afternoon":
      return "下午好";
    case "evening":
      return "晚上好";
    case "night":
      return "";
  }
}

// ===== 第二行环境信息 =====

export function getEnvironmentLine(daysUntilExam: number, streak: number): string {
  const parts: string[] = [];

  if (daysUntilExam > 0) {
    if (daysUntilExam > 365) {
      parts.push(`距离考研还有 ${Math.floor(daysUntilExam / 30)} 个月`);
    } else if (daysUntilExam > 60) {
      parts.push(`距离考研还有 ${daysUntilExam} 天`);
    } else if (daysUntilExam > 7) {
      parts.push(`仅剩 ${daysUntilExam} 天，冲刺阶段`);
    } else if (daysUntilExam > 0) {
      parts.push(`最后 ${daysUntilExam} 天，坚持住`);
    }
  }

  if (streak >= 7) {
    parts.push(`连续打卡 ${streak} 天`);
  }

  return parts.join(" · ");
}
