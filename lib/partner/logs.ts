import { createClient } from "@/lib/supabase";

export interface PartnerLog {
  id: string;
  user_id: string;
  log_date: string;
  content: string;
  log_type: "daily" | "milestone";
  created_at: string;
}

// ===== 观察日志模板库 =====
// 温柔、朋友式的语气，不用数据分析风格

const OBSERVATIONS = {
  // ===== 完成任务 =====
  task_completed: {
    high: [
      "今天完成得不错呢。",
      "今天挺认真的。",
      "今天比平时多完成了一些。",
    ],
    medium: [
      "今天也学了一些。",
      "还可以，不算太差。",
      "今天状态还行。",
    ],
    low: [
      "今天做得不多，不过开始了就好。",
      "今天好像有点累。",
      "不多，但也不错。",
    ],
  },

  // ===== 情绪相关 =====
  emotion_happy: [
    "今天看起来状态不错。",
    "今天心情好像挺好的。",
    "今天感觉有精神呢。",
  ],
  emotion_anxious: [
    "今天好像有点焦虑，慢慢来。",
    "不用着急，一步一步走。",
    "今天压力有点大吧，先做能做的。",
  ],
  emotion_tired: [
    "今天看起来有点累。",
    "今天好像没休息好。",
    "有些疲惫的样子，注意休息。",
  ],

  // ===== 专注 =====
  focus_done: [
    "今天专注了一段时间。",
    "有好好专注呢。",
    "专注的样子不错。",
  ],
  focus_long: [
    "今天专注了很久。",
    "今天很沉浸啊。",
    "今天专注时间比平时长。",
  ],

  // ===== 某学科 =====
  subject: {
    math: ["数学今天做了不少。", "今天在数学上花了一些时间。"],
    english: ["英语今天有进展呢。", "今天背了一些单词吧。"],
    politics: ["政治今天看了看。"],
    major: ["专业课上下了功夫。"],
  },

  // ===== 日常 =====
  just_started: [
    "今天刚开始呢。",
    "今天也按时来了。",
    "回来啦。",
  ],
  day_off: [
    "今天休息了，明天再继续。",
    "休息也是备考的一部分。",
    "今天放松一下没关系。",
  ],
  streak: [
    "连续学习了，很稳。",
    "每天都在学，不错。",
    "坚持本身就是进步。",
  ],
  space_changed: [
    "书桌上多了点东西。",
    "学习角落慢慢丰富了。",
  ],

  // ===== 早晨夜晚 =====
  morning: [
    "早上好，今天也加油。",
    "新的一天开始了。",
  ],
  night: [
    "今天辛苦了，早点休息。",
    "夜深了，该休息了。",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 生成观察日志 =====

export async function generateObservationLog(userId: string): Promise<PartnerLog | null> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();

  // 检查今天是否已经生成过日志
  const { data: existing } = await supabase
    .from("partner_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", today)
    .limit(1);

  if (existing && existing.length > 0) {
    return null; // 今天已有日志
  }

  // 收集数据
  const { data: tasks } = await supabase
    .from("plan_tasks")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00Z`);

  const { data: checkins } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", userId)
    .eq("checkin_date", today);

  const { data: focusSessions } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("started_at", `${today}T00:00:00Z`);

  const completedTasks = tasks?.filter((t) => t.status === "completed") ?? [];
  const totalTasks = tasks?.length ?? 0;
  const completionRate = totalTasks > 0 ? completedTasks.length / totalTasks : 0;

  const recentCheckin = checkins?.[0];
  const totalFocusMinutes = focusSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) ?? 0;

  let content = "";

  // 逻辑：按优先级选择观察内容

  // 1. 如果有打卡情绪，优先使用
  if (recentCheckin?.emotion === "happy") {
    content = pick(OBSERVATIONS.emotion_happy);
  } else if (recentCheckin?.emotion === "anxious") {
    content = pick(OBSERVATIONS.emotion_anxious);
  } else if (recentCheckin?.emotion === "tired") {
    content = pick(OBSERVATIONS.emotion_tired);
  }
  // 2. 专注长时
  else if (totalFocusMinutes >= 60) {
    content = pick(OBSERVATIONS.focus_long);
  } else if (totalFocusMinutes > 0) {
    content = pick(OBSERVATIONS.focus_done);
  }
  // 3. 完成任务情况
  else if (completionRate >= 0.8 && totalTasks > 0) {
    content = pick(OBSERVATIONS.task_completed.high);
  } else if (completionRate >= 0.4 && totalTasks > 0) {
    content = pick(OBSERVATIONS.task_completed.medium);
  } else if (totalTasks > 0 && completionRate < 0.4) {
    content = pick(OBSERVATIONS.task_completed.low);
  }
  // 4. 时间
  else if (hour >= 6 && hour < 9) {
    content = pick(OBSERVATIONS.morning);
  } else if (hour >= 21) {
    content = pick(OBSERVATIONS.night);
  }
  // 5. 连续打卡
  else {
    content = pick(OBSERVATIONS.just_started);
  }

  const { data, error } = await supabase
    .from("partner_logs")
    .insert({
      user_id: userId,
      log_date: today,
      content,
      log_type: "daily",
    })
    .select()
    .single();

  if (error) {
    console.error("[PartnerLog] Failed to create:", error);
    return null;
  }

  return data;
}

// ===== 读取近期观察日志 =====

export async function getRecentLogs(userId: string, limit: number = 5): Promise<PartnerLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_logs")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[PartnerLog] Failed to load:", error);
    return [];
  }

  return data ?? [];
}
