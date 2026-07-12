/**
 * 考研院校搜索模块
 *
 * 从 school_profiles 表中查询目标学校的考研数据。
 * 如果数据库中没有，不编造数据，返回空结果。
 */

import type { SchoolProfile } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

interface SearchOptions {
  /** 模糊匹配，默认 true */
  fuzzy?: boolean;
  /** 限制返回数量，默认 5 */
  limit?: number;
}

/**
 * 按学校名称搜索所有相关专业信息
 */
export async function searchSchool(
  supabase: SupabaseClient,
  schoolName: string,
  options: SearchOptions = {}
): Promise<SchoolProfile[]> {
  const { fuzzy = true, limit = 20 } = options;

  let query = supabase
    .from("school_profiles")
    .select("*");

  if (fuzzy) {
    // 模糊搜索：学校名包含关键词
    query = query.ilike("school", `%${schoolName}%`);
  } else {
    query = query.eq("school", schoolName);
  }

  const { data, error } = await query
    .order("school", { ascending: true })
    .limit(limit);

  if (error || !data) {
    console.error("[SchoolSearch] 查询失败:", error?.message);
    return [];
  }

  return data as SchoolProfile[];
}

/**
 * 精确查找某个学校的某个专业
 */
export async function searchSchoolMajor(
  supabase: SupabaseClient,
  schoolName: string,
  majorName: string
): Promise<SchoolProfile | null> {
  // 先精确匹配
  const { data: exact, error: exactError } = await supabase
    .from("school_profiles")
    .select("*")
    .ilike("school", schoolName)
    .ilike("major", majorName)
    .limit(1);

  if (!exactError && exact && exact.length > 0) {
    return exact[0] as SchoolProfile;
  }

  // 精确没找到，尝试模糊匹配 major
  const { data: fuzzy } = await supabase
    .from("school_profiles")
    .select("*")
    .ilike("school", `%${schoolName}%`)
    .ilike("major", `%${majorName}%`)
    .limit(1);

  if (fuzzy && fuzzy.length > 0) {
    return fuzzy[0] as SchoolProfile;
  }

  return null;
}

/**
 * 获取某个学校的所有专业列表
 */
export async function listSchoolMajors(
  supabase: SupabaseClient,
  schoolName: string
): Promise<{ major: string; exam_subjects: string[] }[]> {
  const { data, error } = await supabase
    .from("school_profiles")
    .select("major, exam_subjects")
    .ilike("school", `%${schoolName}%`);

  if (error || !data) return [];

  return data.map((d) => ({
    major: d.major,
    exam_subjects: d.exam_subjects || [],
  }));
}

/**
 * 按专业搜索开设该专业的学校（含分数线排序）
 */
export async function searchByMajor(
  supabase: SupabaseClient,
  majorName: string,
  options: SearchOptions = {}
): Promise<SchoolProfile[]> {
  const { fuzzy = true, limit = 20 } = options;

  let query = supabase
    .from("school_profiles")
    .select("*");

  if (fuzzy) {
    query = query.ilike("major", `%${majorName}%`);
  } else {
    query = query.eq("major", majorName);
  }

  const { data, error } = await query
    .order("cutoff_score", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data as SchoolProfile[];
}

/**
 * 格式化院校信息用于注入 prompt
 */
export function formatSchoolContext(school: SchoolProfile): string {
  const parts: string[] = [];

  if (school.school_tier) parts.push(`学校层次：${school.school_tier}`);
  if (school.major_ranking) parts.push(`学科评估：${school.major_ranking}`);
  if (school.cutoff_score) parts.push(`近年复试线：${school.cutoff_score}分`);
  if (school.avg_admission_score) parts.push(`录取平均分：${school.avg_admission_score}分`);
  if (school.competition_ratio) parts.push(`报录比：${school.competition_ratio}`);
  if (school.enrollment_quota) parts.push(`拟招生人数：${school.enrollment_quota}人`);
  if (school.exam_subjects && school.exam_subjects.length > 0) {
    parts.push(`初试科目：${school.exam_subjects.join("、")}`);
  }
  if (school.notes) parts.push(`备注：${school.notes}`);

  return `===== ${school.school} ${school.major} 考研数据 =====\n${parts.join("\n")}`;
}
