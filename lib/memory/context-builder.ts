import type { SupabaseClient } from "@supabase/supabase-js";
import { buildMemorySummary } from "@/lib/memory/memory-manager";
import type { DailySnapshot, SessionSummary } from "@/lib/types";
import { getCoachConfig, buildCoachModePrompt } from "@/lib/memory/coach-personality";
import { getLatestStudentState } from "@/lib/analysis/student-state";
import type { StudentState } from "@/lib/types";

/**
 * 构建完整的 AI 对话上下文
 * 包含：用户画像、长期记忆、近期快照、历史会话
 */
export async function buildFullContext(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const parts: string[] = [];

  // 1. 长期记忆
  const memorySummary = await buildMemorySummary(supabase, userId);
  if (memorySummary) {
    parts.push("【我对你的了解】\n" + memorySummary);
  }

  // 2. 学生状态分析
  const studentState = await getLatestStudentState(supabase, userId);
  if (studentState) {
    parts.push(buildStateContext(studentState));
  }

  // 3. 近期学习快照（近 7 天）
  const snapshotContext = await buildSnapshotContext(supabase, userId);
  if (snapshotContext) {
    parts.push(snapshotContext);
  }

  // 3. 上次会话摘要
  const lastSessionContext = await buildLastSessionContext(supabase, userId);
  if (lastSessionContext) {
    parts.push(lastSessionContext);
  }


  // 4. ????
  const coachConfig = await getCoachConfig(supabase, userId);
  const coachPrompt = buildCoachModePrompt(coachConfig);

  if (parts.length === 0) return coachPrompt;

  return (
    "\n\n===== 以下是 AI 对你历史情况的了解，请基于此回答问题 =====\n" +
    parts.join("\n\n") +
    "\n\n===== 掌握以上信息后，请给出针对性的建议 ====="
  );
}

/**
 * 构建近期快照上下文（近 7 天）
 */
export function buildStateContext(state: StudentState): string {
  const labelMap: Record<string, string> = {
    high: "高",
    medium: "中",
    low: "低",
    rising: "上升",
    stable: "稳定",
    declining: "下降",
    normal: "正常",
  };

  return [
    "【当前学生状态】",
    "学习动力：" + (labelMap[state.motivation] ?? state.motivation),
    "完成趋势：" + (labelMap[state.completion_trend] ?? state.completion_trend),
    "风险等级：" + (labelMap[state.risk_level] ?? state.risk_level),
    "压力状态：" + (labelMap[state.stress_level] ?? state.stress_level),
    "连续学习：" + state.streak_days + " 天",
    "近7日平均完成率：" + state.avg_completion_rate + "%",
    "近7日平均学习时间：" + state.avg_daily_hours + " 小时",
    state.weak_subjects.length > 0 ? "薄弱科目：" + state.weak_subjects.join("、") : "",
    state.risk_reasons.length > 0 ? "风险因素：" + state.risk_reasons.join("；") : "",
    state.suggestions.length > 0 ? "建议：" + state.suggestions.join("；") : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function buildSnapshotContext(
  supabase: SupabaseClient,
  userId: string,
  days: number = 7
): Promise<string> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  const { data: snapshots } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("user_id", userId)
    .gte("date", sevenDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false })
    .limit(days);

  if (!snapshots || snapshots.length === 0) return "";

  const lines: string[] = ["【近期学习趋势】"];
  let totalHours = 0;
  let totalCompletion = 0;

  for (const s of snapshots as DailySnapshot[]) {
    const dateLabel = s.date.slice(5); // MM-DD
    const energyStars = "●".repeat(s.energy_level ?? 3) + "○".repeat(5 - (s.energy_level ?? 3));
    lines.push(
      `  ${dateLabel}: ${s.total_hours}h 完成${s.completion_rate}% 精力${energyStars}` +
        (s.difficulties?.length ? ` 困难: ${s.difficulties.join(",")}` : "")
    );
    totalHours += s.total_hours;
    totalCompletion += s.completion_rate;
  }

  const avgHours = (totalHours / snapshots.length).toFixed(1);
  const avgCompletion = Math.round(totalCompletion / snapshots.length);
  lines.push(
    `  近 ${snapshots.length} 天平均: ${avgHours}h/天, 完成率 ${avgCompletion}%`
  );

  return lines.join("\n");
}

/**
 * 构建最近一次会话摘要上下文
 */
export async function buildLastSessionContext(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data: sessions } = await supabase
    .from("session_summaries")
    .select("*")
    .eq("user_id", userId)
    .not("session_end", "is", null)
    .order("session_end", { ascending: false })
    .limit(2);

  if (!sessions || sessions.length === 0) return "";

  const lines: string[] = ["【之前的对话记录】"];

  for (const s of sessions as SessionSummary[]) {
    const dateLabel = new Date(s.session_end ?? s.created_at).toLocaleDateString(
      "zh-CN",
      { month: "2-digit", day: "2-digit" }
    );

    if (s.key_topics?.length) {
      lines.push(`  ${dateLabel}: 讨论了 ${s.key_topics.join("、")}`);
    }
    if (s.user_concerns?.length) {
      lines.push(`    你关注: ${s.user_concerns.join("、")}`);
    }
    if (s.ai_suggestions?.length) {
      lines.push(`    我的建议: ${s.ai_suggestions.join("、")}`);
    }
    if (s.mood) {
      const moodLabel: Record<string, string> = {
        positive: "积极",
        neutral: "平稳",
        negative: "低落",
        frustrated: "焦虑",
      };
      lines.push(`    情绪状态: ${moodLabel[s.mood] ?? s.mood}`);
    }
  }

  return lines.join("\n");
}

/**
 * 获取用户最近状态摘要（简短版，用于 checkin 反馈）
 */
export async function buildStatusSummary(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  // 获取最近 3 天快照
  const recent = await buildSnapshotContext(supabase, userId, 3);

  // 获取待处理的提醒
  const { data: reminders } = await supabase
    .from("reminders")
    .select("title, message")
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(2);

  const parts: string[] = [];

  if (recent) parts.push(recent);

  if (reminders && reminders.length > 0) {
    parts.push(
      "【待处理提醒】\n" +
        reminders
          .map((r) => `  ${r.title}: ${r.message}`)
          .join("\n")
    );
  }

  return parts.join("\n\n");
}


