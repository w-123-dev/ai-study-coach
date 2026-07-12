import type { SupabaseClient } from "@supabase/supabase-js";
import { callDeepSeek } from "@/lib/deepseek";

/**
 * AI 主动教练 — 检测引擎
 *
 * 自动检测4类学习问题：
 * 1. 连续未学习（2天以上无打卡）
 * 2. 完成率下降（比上周降20%+）
 * 3. 某科停滞（某科3天无完成记录）
 * 4. 长期焦虑（7天内有3天焦虑/疲惫）
 *
 * 检测到问题后调用 DeepSeek 生成教练式消息，
 * 存入 coach_messages 表供首页展示。
 */

// ============================================================
// 类型定义
// ============================================================

export interface DetectionResult {
  detected: boolean;
  type: "no_study" | "completion_drop" | "subject_stagnation" | "anxiety" | null;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  relatedSubject?: string;
}

export interface CoachMessage {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_subject: string | null;
  severity: string;
  status: string;
  detection_data: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
}

// ============================================================
// 主检测函数 — 运行所有检测
// ============================================================

export async function runCoachDetection(
  supabase: SupabaseClient,
  userId: string
): Promise<DetectionResult[]> {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 并行收集检测数据
    const [snapshots, tasks, checkins, recentMessages] = await Promise.all([
      // 最近 7 天快照
      supabase
        .from("daily_snapshots")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(7),

      // 最近 7 天任务
      supabase
        .from("plan_tasks")
        .select("subject, status, completed_at, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(50),

      // 最近 7 天打卡
      supabase
        .from("daily_checkins")
        .select("checkin_date, study_hours, tasks_completed, tasks_total, emotion, ai_feedback")
        .eq("user_id", userId)
        .order("checkin_date", { ascending: false })
        .limit(7),

      // 最近已生成的同类型消息（避免重复）
      supabase
        .from("coach_messages")
        .select("type, created_at")
        .eq("user_id", userId)
        .eq("status", "unread")
        .gte("created_at", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    if (snapshots.error || tasks.error) {
      console.error("[CoachDetector] 数据加载失败");
      return [];
    }

    const results: DetectionResult[] = [];

    // 检测 1: 连续未学习
    const noStudyResult = detectNoStudy(
      checkins.data ?? [],
      today,
      recentMessages.data ?? []
    );
    if (noStudyResult) results.push(noStudyResult);

    // 检测 2: 完成率下降
    const completionResult = detectCompletionDrop(
      snapshots.data ?? [],
      recentMessages.data ?? []
    );
    if (completionResult) results.push(completionResult);

    // 检测 3: 某科停滞
    const stagnationResult = detectSubjectStagnation(
      tasks.data ?? [],
      recentMessages.data ?? []
    );
    if (stagnationResult) results.push(stagnationResult);

    // 检测 4: 长期焦虑
    const anxietyResult = detectAnxiety(
      snapshots.data ?? [],
      checkins.data ?? [],
      recentMessages.data ?? []
    );
    if (anxietyResult) results.push(anxietyResult);

    return results;
  } catch (error) {
    console.error("[CoachDetector] 检测失败:", error);
    return [];
  }
}

// ============================================================
// 单个检测函数
// ============================================================

/**
 * 检测 1: 连续未学习（2天以上无打卡）
 */
function detectNoStudy(
  checkins: any[],
  today: string,
  recentMessages: any[]
): DetectionResult | null {
  // 检查最近3天是否有打卡
  const checkinDates = new Set(
    checkins.map((c) => c.checkin_date)
  );

  // 计算连续未打卡天数
  let missedDays = 0;
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (!checkinDates.has(dateStr)) {
      missedDays++;
    } else {
      break; // 有打卡就停止
    }
  }

  if (missedDays < 2) return null;

  // 避免重复提醒（3天内已有同类型未读消息）
  const hasRecent = recentMessages.some(
    (m: any) => m.type === "no_study"
  );
  if (hasRecent) return null;

  return {
    detected: true,
    type: "no_study",
    title: `已连续 ${missedDays} 天未学习`,
    message: `我发现你已经有 ${missedDays} 天没有登录学习了。考研是持久战，即使每天只学30分钟，也比完全中断好。今天回来，我们一起重新开始。`,
    severity: missedDays >= 3 ? "critical" : "warning",
  };
}

/**
 * 检测 2: 完成率下降（比上周降20%+）
 */
function detectCompletionDrop(
  snapshots: any[],
  recentMessages: any[]
): DetectionResult | null {
  if (snapshots.length < 4) return null;

  // 排序：旧 -> 新
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 前一半 vs 后一半
  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid);
  const secondHalf = sorted.slice(mid);

  const firstAvg =
    firstHalf.reduce((s: number, r: any) => s + (r.completion_rate ?? 0), 0) /
    firstHalf.length;
  const secondAvg =
    secondHalf.reduce((s: number, r: any) => s + (r.completion_rate ?? 0), 0) /
    secondHalf.length;

  if (secondAvg >= firstAvg - 15) return null; // 下降不足 15%

  // 避免重复
  const hasRecent = recentMessages.some(
    (m: any) => m.type === "completion_drop"
  );
  if (hasRecent) return null;

  const dropPercent = Math.round(firstAvg - secondAvg);

  return {
    detected: true,
    type: "completion_drop",
    title: `完成率下降了 ${dropPercent}%`,
    message: `最近你的任务完成率从 ${Math.round(firstAvg)}% 降到了 ${Math.round(secondAvg)}%。是不是任务量太大了？我们可以一起调整计划，让节奏更适合你。`,
    severity: dropPercent >= 30 ? "critical" : "warning",
  };
}

/**
 * 检测 3: 某科停滞（某科3天无完成记录）
 */
function detectSubjectStagnation(
  tasks: any[],
  recentMessages: any[]
): DetectionResult | null {
  // 按科目分组，统计最近完成的任务
  const subjectMap = new Map<string, { completed: number; total: number; latestDate: string | null }>();

  for (const task of tasks) {
    if (!subjectMap.has(task.subject)) {
      subjectMap.set(task.subject, {
        completed: 0,
        total: 0,
        latestDate: null,
      });
    }
    const entry = subjectMap.get(task.subject)!;
    entry.total++;
    if (task.status === "completed") {
      entry.completed++;
      if (!entry.latestDate || task.updated_at > entry.latestDate) {
        entry.latestDate = task.updated_at;
      }
    }
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  for (const [subject, stats] of subjectMap.entries()) {
    // 该科目有任务，但最近3天没有完成记录
    if (stats.total > 0 && (!stats.latestDate || new Date(stats.latestDate) < threeDaysAgo)) {
      // 避免重复
      const hasRecent = recentMessages.some(
        (m: any) => m.type === "subject_stagnation" && m.related_subject === subject
      );
      if (hasRecent) continue;

      // 计算停滞天数
      const lastDate = stats.latestDate ? new Date(stats.latestDate) : null;
      const stagnantDays = lastDate
        ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        : 3;

      if (stagnantDays < 3) continue;

      return {
        detected: true,
        type: "subject_stagnation",
        title: `${subject} 已停滞 ${stagnantDays} 天`,
        message: `我发现你最近 ${stagnantDays} 天没有完成 ${subject} 的任务了。如果这个科目让你感到困难，我们可以把它拆成更小的任务，比如每天只做一道题。`,
        severity: stagnantDays >= 5 ? "warning" : "info",
        relatedSubject: subject,
      };
    }
  }

  return null;
}

/**
 * 检测 4: 长期焦虑（最近7天有3天以上焦虑或疲惫）
 */
function detectAnxiety(
  snapshots: any[],
  checkins: any[],
  recentMessages: any[]
): DetectionResult | null {
  // 从 snapshots 的 emotion 字段检测
  let anxiousDays = 0;
  let totalDays = 0;

  for (const snap of snapshots) {
    if (snap.emotion === "anxious" || snap.emotion === "tired") {
      anxiousDays++;
    }
    totalDays++;
  }

  // 也从 checkins 中检测
  for (const checkin of checkins) {
    if (checkin.emotion === "anxious" || checkin.emotion === "tired") {
      // 避免重复计数
      const hasSnap = snapshots.some(
        (s: any) => s.date === checkin.checkin_date
      );
      if (!hasSnap) {
        anxiousDays++;
        totalDays++;
      }
    } else if (!snapshots.some((s: any) => s.date === checkin.checkin_date)) {
      totalDays++;
    }
  }

  if (totalDays < 3) return null;
  const anxietyRate = anxiousDays / totalDays;

  if (anxietyRate < 0.4) return null; // 焦虑比例不足 40%

  // 避免重复
  const hasRecent = recentMessages.some((m: any) => m.type === "anxiety");
  if (hasRecent) return null;

  const severity =
    anxietyRate >= 0.7
      ? "critical"
      : anxietyRate >= 0.5
      ? "warning"
      : "info";

  return {
    detected: true,
    type: "anxiety",
    title: `最近学习压力较大`,
    message:
      anxietyRate >= 0.7
        ? `最近 ${totalDays} 天中有 ${anxiousDays} 天你感到焦虑或疲惫。考研压力大是正常的，但长期高压会影响效率。建议今天给自己放个假，或者和我聊聊最近的困扰。`
        : `最近你多次感到疲惫或焦虑。考研是马拉松，不是冲刺。建议适当减少每日任务量，保证充足的休息。`,
    severity,
  };
}

// ============================================================
// AI 生成教练消息（调用 DeepSeek 润色）
// ============================================================

export async function generateCoachMessage(
  result: DetectionResult,
  profile: { school: string; major: string; level: string }
): Promise<string> {
  const prompt = `你是一位专业的考研教练。请根据以下检测结果，生成一段简短、温暖、有行动指导的教练消息。

检测类型：${result.type}
检测标题：${result.title}
原始消息：${result.message}
严重程度：${result.severity}

用户信息：
- 目标院校：${profile.school}
- 目标专业：${profile.major}
- 当前水平：${profile.level}

要求：
1. 保持温暖关心的语气，但要有明确的行动建议
2. 长度控制在 80-150 字
3. 不要使用"亲爱的"等过度亲昵用语
4. 以"我注意到"或"我发现"开头
5. 最后给出一个具体可操作的建议

只返回消息正文，不要返回其他内容。`;

  try {
    const aiMessage = await callDeepSeek(prompt, {
      systemPrompt: "你是一位温暖但专业的考研教练，擅长发现学生学习问题并给出具体建议。",
      temperature: 0.7,
      maxTokens: 500,
    });
    return aiMessage.trim();
  } catch (error) {
    console.warn("[CoachDetector] AI 生成失败，使用默认消息:", error);
    return result.message;
  }
}

// ============================================================
// 保存检测结果到数据库
// ============================================================

export async function saveCoachMessages(
  supabase: SupabaseClient,
  userId: string,
  results: DetectionResult[]
): Promise<CoachMessage[]> {
  if (results.length === 0) return [];

  const saved: CoachMessage[] = [];

  for (const result of results) {
    // 读取用户资料用于 AI 生成
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("school, major, level")
      .eq("user_id", userId)
      .single();

    // AI 润色消息
    const message = profile
      ? await generateCoachMessage(result, profile)
      : result.message;

    const { data, error } = await supabase
      .from("coach_messages")
      .insert({
        user_id: userId,
        type: result.type,
        title: result.title,
        message,
        related_subject: result.relatedSubject ?? null,
        severity: result.severity,
        status: "unread",
        detection_data: {
          detected_at: new Date().toISOString(),
          original_message: result.message,
        },
      })
      .select()
      .single();

    if (error) {
      console.error("[CoachDetector] 保存消息失败:", error);
      continue;
    }

    saved.push(data as CoachMessage);
  }

  return saved;
}

// ============================================================
// 完整检测流程（供 API 调用）
// ============================================================

export async function detectAndSave(
  supabase: SupabaseClient,
  userId: string
): Promise<CoachMessage[]> {
  // 1. 运行检测
  const results = await runCoachDetection(supabase, userId);

  if (results.length === 0) return [];

  // 2. 保存到数据库
  const messages = await saveCoachMessages(supabase, userId, results);

  console.log(
    `[CoachDetector] 用户 ${userId}：检测到 ${results.length} 个问题，已生成 ${messages.length} 条消息`
  );

  return messages;
}

// ============================================================
// 获取未读教练消息
// ============================================================

export async function getUnreadCoachMessages(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 5
): Promise<CoachMessage[]> {
  const { data } = await supabase
    .from("coach_messages")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "unread")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as CoachMessage[];
}

/**
 * 获取最近教练消息（含已读，用于展示历史）
 */
export async function getRecentCoachMessages(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 10
): Promise<CoachMessage[]> {
  const { data } = await supabase
    .from("coach_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as CoachMessage[];
}

// ============================================================
// 标记消息状态
// ============================================================

export async function markCoachMessage(
  supabase: SupabaseClient,
  messageId: string,
  userId: string,
  status: "read" | "dismissed"
): Promise<boolean> {
  const update: Record<string, any> = { status };

  if (status === "read") {
    update.read_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("coach_messages")
    .update(update)
    .eq("id", messageId)
    .eq("user_id", userId);

  if (error) {
    console.error("[CoachDetector] 更新消息状态失败:", error);
    return false;
  }

  return true;
}
