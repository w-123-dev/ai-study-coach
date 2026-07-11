f = open("lib/types.ts", "a", encoding="utf-8")
f.write("""

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
  created_at: string;
  updated_at: string;
}
""")
f.close()
print("done")
