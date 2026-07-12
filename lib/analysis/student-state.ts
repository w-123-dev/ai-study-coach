import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DailySnapshot,
  StudentState,
  Motivation,
  CompletionTrend,
  RiskLevel,
  StressLevel,
  StateAnalysisInput,
} from "@/lib/types";

/**
 * 学生状态分析引擎
 * 综合分析 DailySnapshot、plan_tasks、UserMemory 计算当前状态
 */

// ============================================================
// 核心分析函数
// ============================================================

/**
 * 读取数据并计算学生状态
 */
export async function analyzeStudentState(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentState | null> {
  try {
    const input = await gatherAnalysisData(supabase, userId);
    if (!input) return null;

    return computeState(input);
  } catch (error) {
    console.error("[StudentState] 分析失败:", error);
    return null;
  }
}

/**
 * 分析并保存状态到数据库
 */
export async function analyzeAndSaveState(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentState | null> {
  try {
    const state = await analyzeStudentState(supabase, userId);
    if (!state) return null;

    await saveStudentState(supabase, userId, state);
    return state;
  } catch (error) {
    console.error("[StudentState] 保存失败:", error);
    return null;
  }
}

/**
 * 从数据库读取最新的学生状态
 */
export async function getLatestStudentState(
  supabase: SupabaseClient,
  userId: string
): Promise<StudentState | null> {
  const { data } = await supabase
    .from("student_states")
    .select("*")
    .eq("user_id", userId)
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    user_id: data.user_id,
    motivation: data.motivation as Motivation,
    completion_trend: data.completion_trend as CompletionTrend,
    risk_level: data.risk_level as RiskLevel,
    stress_level: data.stress_level as StressLevel,
    weak_subjects: data.weak_subjects ?? [],
    avg_daily_hours: data.avg_daily_hours ?? 0,
    avg_completion_rate: data.avg_completion_rate ?? 0,
    streak_days: data.streak_days ?? 0,
    delay_count: data.delay_count ?? 0,
    total_tasks: data.total_tasks ?? 0,
    completed_tasks: data.completed_tasks ?? 0,
    risk_reasons: data.risk_reasons ?? [],
    suggestions: data.suggestions ?? [],
    analyzed_at: data.analyzed_at,
  };
}

// ============================================================
// 数据采集
// ============================================================

async function gatherAnalysisData(
  supabase: SupabaseClient,
  userId: string
): Promise<StateAnalysisInput | null> {
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString().split("T")[0];
  const fourteenDaysAgo = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000
  ).toISOString().split("T")[0];

  // 1. 获取最近 14 天快照
  const { data: snapshots } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("user_id", userId)
    .gte("date", fourteenDaysAgo)
    .lte("date", today)
    .order("date", { ascending: false });

  // 2. 获取最近 14 天的任务
  const { data: tasks } = await supabase
    .from("plan_tasks")
    .select("subject, status, delay_count, planned_hours, actual_hours")
    .eq("user_id", userId)
    .gte("created_at", fourteenDaysAgo)
    .order("created_at", { ascending: false });

  // 3. 获取用户记忆
  const { data: memories } = await supabase
    .from("user_memories")
    .select("category, content, confidence")
    .eq("user_id", userId)
    .gte("confidence", 5);

  // 4. 获取用户画像
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("weak_subjects, daily_hours, level")
    .eq("user_id", userId)
    .single();

  if (!snapshots && !tasks) return null;

  return {
    recentSnapshots: (snapshots ?? []) as DailySnapshot[],
    recentTasks: (tasks ?? []).map((t) => ({
      subject: t.subject,
      status: t.status,
      delay_count: t.delay_count ?? 0,
      planned_hours: t.planned_hours ?? 0,
      actual_hours: t.actual_hours ?? 0,
    })),
    memories: (memories ?? []).map((m) => ({
      category: m.category,
      content: m.content,
      confidence: m.confidence ?? 5,
    })),
    profile: {
      weak_subjects: (profile as { weak_subjects?: string[] })?.weak_subjects ?? [],
      daily_hours: (profile as { daily_hours?: number })?.daily_hours ?? 6,
      level: (profile as { level?: string })?.level ?? "unknown",
    },
  };
}

// ============================================================
// 状态计算引擎
// ============================================================

function computeState(input: StateAnalysisInput): StudentState {
  const { recentSnapshots, recentTasks, memories, profile } = input;

  const riskReasons: string[] = [];
  const suggestions: string[] = [];

  // ---- 基础统计 ----
  const recent7 = recentSnapshots.slice(0, 7);
  const recent3 = recentSnapshots.slice(0, 3);

  const avgCompletion =
    recent7.length > 0
      ? recent7.reduce((s, r) => s + (r.completion_rate ?? 0), 0) / recent7.length
      : 0;

  const avgHours =
    recent7.length > 0
      ? recent7.reduce((s, r) => s + (r.total_hours ?? 0), 0) / recent7.length
      : 0;

  // ---- 连续学习天数（streak）----
  const streakDays = computeStreak(recentSnapshots);

  // ---- 延迟任务数 ----
  const delayCount = recentTasks.filter((t) => t.status === "delayed").length;

  // ---- 已完成/总任务 ----
  const totalTasks = recentTasks.length;
  const completedTasks = recentTasks.filter((t) => t.status === "completed").length;

  // ============================================================
  // 1. 完成趋势
  // ============================================================
  const completionTrend = computeCompletionTrend(recentSnapshots);

  // ============================================================
  // 2. 薄弱科目
  // ============================================================
  const weakSubjects = computeWeakSubjects(recentTasks, profile.weak_subjects, memories);

  // ============================================================
  // 3. 学习动力
  // ============================================================
  const motivation = computeMotivation(
    avgCompletion,
    avgHours,
    streakDays,
    profile.daily_hours
  );

  if (motivation === "low") {
    riskReasons.push("学习动力偏低");
    suggestions.push("尝试从 25 分钟学习开始，降低心理门槛");
  }

  // ============================================================
  // 4. 压力状态
  // ============================================================
  const stressLevel = computeStressLevel(recentSnapshots, memories);

  if (stressLevel === "high") {
    riskReasons.push("压力状态偏高");
    suggestions.push("建议适当安排休息日，调整学习节奏");
  }

  // ============================================================
  // 5. 风险等级
  // ============================================================
  const riskLevel = computeRiskLevel(
    avgCompletion,
    delayCount,
    streakDays,
    completionTrend
  );

  if (riskLevel === "high") {
    riskReasons.push("整体风险较高");
    suggestions.push("建议重新评估当前计划，适当降低强度");
  }

  // ---- 通用建议 ----
  if (weakSubjects.length > 0) {
    suggestions.push(
      `薄弱科目 ${weakSubjects.join("、")} 建议增加专项训练时间`
    );
  }

  if (streakDays >= 5) {
    suggestions.push("已连续学习 ${streakDays} 天，保持住！");
  }

  if (completionTrend === "declining") {
    suggestions.push("近期完成率下降，检查是否任务量过大");
  }

  return {
    user_id: "",
    motivation,
    completion_trend: completionTrend,
    risk_level: riskLevel,
    stress_level: stressLevel,
    weak_subjects: weakSubjects,
    avg_daily_hours: Math.round(avgHours * 10) / 10,
    avg_completion_rate: Math.round(avgCompletion),
    streak_days: streakDays,
    delay_count: delayCount,
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    risk_reasons: riskReasons,
    suggestions: suggestions.slice(0, 5),
    analyzed_at: new Date().toISOString(),
  };
}

// ============================================================
// 各维度计算函数
// ============================================================

function computeCompletionTrend(
  snapshots: DailySnapshot[]
): CompletionTrend {
  if (snapshots.length < 4) return "stable";

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const recent3 = sorted.slice(-3);
  const earlier = sorted.slice(0, -3);

  const recentAvg =
    recent3.reduce((s, r) => s + (r.completion_rate ?? 0), 0) / recent3.length;
  const earlierAvg =
    earlier.reduce((s, r) => s + (r.completion_rate ?? 0), 0) / earlier.length;

  if (recentAvg > earlierAvg + 15) return "rising";
  if (recentAvg < earlierAvg - 15) return "declining";
  return "stable";
}

function computeWeakSubjects(
  tasks: StateAnalysisInput["recentTasks"],
  profileWeakSubjects: string[],
  memories: StateAnalysisInput["memories"]
): string[] {
  const subjectMap = new Map<string, { completed: number; total: number }>();

  for (const task of tasks) {
    const entry = subjectMap.get(task.subject) ?? { completed: 0, total: 0 };
    entry.total++;
    if (task.status === "completed") entry.completed++;
    subjectMap.set(task.subject, entry);
  }

  // 完成率 < 50% 的科目视为薄弱
  const weakFromTasks = Array.from(subjectMap.entries())
    .filter(([, stats]) => stats.total >= 2 && stats.completed / stats.total < 0.5)
    .map(([subject]) => subject);

  // 合并记忆中的薄弱信息
  const weakFromMemory = memories
    .filter((m) => m.category === "weakness")
    .flatMap((m) => m.content.replace(/^薄弱科目[：:]/, "").split(/[、,，]/));

  const combined = new Set([
    ...profileWeakSubjects,
    ...weakFromTasks,
    ...weakFromMemory,
  ]);

  return Array.from(combined).slice(0, 5);
}

function computeMotivation(
  avgCompletion: number,
  avgHours: number,
  streakDays: number,
  dailyHours: number
): Motivation {
  if (avgCompletion >= 80 && avgHours >= dailyHours * 0.8 && streakDays >= 5) {
    return "high";
  }
  if (avgCompletion >= 50 && avgHours >= dailyHours * 0.5) {
    return "medium";
  }
  return "low";
}

function computeStressLevel(
  snapshots: DailySnapshot[],
  memories: StateAnalysisInput["memories"]
): StressLevel {
  const recent = snapshots.slice(0, 7);
  if (recent.length === 0) return "normal";

  const anxiousCount = recent.filter(
    (r) => r.emotion === "anxious" || r.emotion === "tired"
  ).length;

  const lowEnergyCount = recent.filter((r) => r.energy === "low").length;

  // 记忆中的焦虑信息
  const hasAnxietyMemory = memories.some(
    (m) => m.category === "concern" && m.confidence >= 7
  );

  if (
    anxiousCount >= 4 ||
    lowEnergyCount >= 3 ||
    (hasAnxietyMemory && anxiousCount >= 2)
  ) {
    return "high";
  }

  if (anxiousCount >= 2 || lowEnergyCount >= 1) {
    return "normal";
  }

  return "low";
}

function computeRiskLevel(
  avgCompletion: number,
  delayCount: number,
  streakDays: number,
  completionTrend: CompletionTrend
): RiskLevel {
  let score = 0;

  if (avgCompletion < 40) score += 3;
  else if (avgCompletion < 60) score += 2;
  else if (avgCompletion < 80) score += 1;

  if (delayCount > 5) score += 3;
  else if (delayCount > 2) score += 2;
  else if (delayCount > 0) score += 1;

  if (streakDays === 0) score += 2;
  else if (streakDays < 3) score += 1;

  if (completionTrend === "declining") score += 2;

  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

function computeStreak(snapshots: DailySnapshot[]): number {
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  let expectedDate = today;

  for (const snap of sorted) {
    if (snap.date === expectedDate) {
      if ((snap.completion_rate ?? 0) >= 50) {
        streak++;
        // 往前推一天
        const d = new Date(expectedDate);
        d.setDate(d.getDate() - 1);
        expectedDate = d.toISOString().split("T")[0];
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

// ============================================================
// 保存到数据库
// ============================================================

async function saveStudentState(
  supabase: SupabaseClient,
  userId: string,
  state: StudentState
): Promise<void> {
  const record = {
    user_id: userId,
    motivation: state.motivation,
    completion_trend: state.completion_trend,
    risk_level: state.risk_level,
    stress_level: state.stress_level,
    weak_subjects: state.weak_subjects,
    avg_daily_hours: state.avg_daily_hours,
    avg_completion_rate: state.avg_completion_rate,
    streak_days: state.streak_days,
    delay_count: state.delay_count,
    total_tasks: state.total_tasks,
    completed_tasks: state.completed_tasks,
    risk_reasons: state.risk_reasons,
    suggestions: state.suggestions,
    analyzed_at: new Date().toISOString(),
  };

  // upsert — 每个用户只保留一条记录
  const { error } = await supabase.from("student_states").upsert(record, {
    onConflict: "user_id",
    ignoreDuplicates: false,
  });

  if (error) {
    console.error("[StudentState] 保存失败:", error);
  }
}
