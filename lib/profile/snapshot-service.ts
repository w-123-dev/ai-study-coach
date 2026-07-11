import type { SupabaseClient } from "@supabase/supabase-js";

export interface SnapshotInput {
  totalHours: number;
  tasksCompleted: number;
  tasksTotal: number;
  energyLevel: number;
  difficulties: string[];
  subjectHours?: Record<string, number>;
  subjectCompletion?: Record<string, number>;
  emotion?: string;
  energy?: string;
  memo?: string;
}

/**
 * 创建或更新每日快照
 * 调用时机：用户完成每日打卡后
 */
export async function createOrUpdateSnapshot(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  input: SnapshotInput
): Promise<boolean> {
  const completionRate =
    input.tasksTotal > 0
      ? Math.round((input.tasksCompleted / input.tasksTotal) * 100)
      : 0;

  // 对比前一天的完成率来判断情绪趋势
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const { data: prevSnapshot } = await supabase
    .from("daily_snapshots")
    .select("completion_rate")
    .eq("user_id", userId)
    .eq("date", yesterdayStr)
    .single();

  let emotionTrend: "up" | "down" | "stable" = "stable";
  if (prevSnapshot) {
    const prevRate = (prevSnapshot as { completion_rate: number }).completion_rate ?? 0;
    if (completionRate > prevRate + 10) emotionTrend = "up";
    else if (completionRate < prevRate - 10) emotionTrend = "down";
  }

  const { error } = await supabase.from("daily_snapshots").upsert(
    {
      user_id: userId,
      date,
      total_hours: input.totalHours,
      completion_rate: completionRate,
      energy_level: Math.min(Math.max(input.energyLevel, 1), 5),
      difficulties: input.difficulties,
      subject_hours: input.subjectHours ?? {},
      subject_completion: input.subjectCompletion ?? {},
      emotion_trend: emotionTrend,
      emotion: input.emotion ?? null,
      energy: input.energy ?? null,
      memo: input.memo ?? null,
    },
    { onConflict: "user_id,date" }
  );

  if (error) {
    console.error("[SnapshotService] 创建快照失败:", error);
    return false;
  }

  return true;
}

/**
 * 合并学科数据到快照
 * 当用户按学科记录了学习时长时调用
 */
export async function mergeSubjectData(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  subject: string,
  hours: number,
  completionPercent: number
): Promise<boolean> {
  // 读取当前快照
  const { data: current } = await supabase
    .from("daily_snapshots")
    .select("subject_hours, subject_completion")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (!current) return false;

  const curr = current as {
    subject_hours: Record<string, number>;
    subject_completion: Record<string, number>;
  };

  const updatedHours = { ...(curr.subject_hours ?? {}), [subject]: hours };
  const updatedCompletion = {
    ...(curr.subject_completion ?? {}),
    [subject]: completionPercent,
  };

  const { error } = await supabase
    .from("daily_snapshots")
    .update({
      subject_hours: updatedHours,
      subject_completion: updatedCompletion,
    })
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    console.error("[SnapshotService] 合并学科数据失败:", error);
    return false;
  }

  return true;
}

/**
 * 获取多个日期的快照（用于趋势分析）
 */
export async function getSnapshots(
  supabase: SupabaseClient,
  userId: string,
  days: number = 30
): Promise<SnapshotRecord[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: false });

  return (data ?? []) as SnapshotRecord[];
}

export interface SnapshotRecord {
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
  emotion: string | null;
  energy: string | null;
  memo: string | null;
  ai_summary: string | null;
}

/**
 * 计算本周统计摘要
 */
export function computeWeekSummary(snapshots: SnapshotRecord[]): {
  totalHours: number;
  avgHours: number;
  avgCompletion: number;
  studyDays: number;
  bestDay: string | null;
  worstDay: string | null;
} {
  if (snapshots.length === 0) {
    return {
      totalHours: 0,
      avgHours: 0,
      avgCompletion: 0,
      studyDays: 0,
      bestDay: null,
      worstDay: null,
    };
  }

  const totalHours = snapshots.reduce((s, r) => s + r.total_hours, 0);
  const avgHours = totalHours / snapshots.length;
  const avgCompletion = Math.round(
    snapshots.reduce((s, r) => s + r.completion_rate, 0) / snapshots.length
  );
  const studyDays = snapshots.length;

  const sorted = [...snapshots].sort(
    (a, b) => b.completion_rate - a.completion_rate
  );
  const bestDay = sorted[0]?.date ?? null;
  const worstDay = sorted[sorted.length - 1]?.date ?? null;

  return { totalHours, avgHours, avgCompletion, studyDays, bestDay, worstDay };
}
