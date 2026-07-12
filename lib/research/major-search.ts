/**
 * 考研专业检索模块
 *
 * 查询专业对应的考试科目、学科门类等信息。
 * 结合 school-search.ts 使用。
 */

import type { SchoolProfile } from "@/lib/types";

/** 学科门类 */
export const DISCIPLINE_CATEGORIES: Record<string, string> = {
  "01": "哲学",
  "02": "经济学",
  "03": "法学",
  "04": "教育学",
  "05": "文学",
  "06": "历史学",
  "07": "理学",
  "08": "工学",
  "09": "农学",
  "10": "医学",
  "11": "军事学",
  "12": "管理学",
  "13": "艺术学",
  "14": "交叉学科",
};

/** 公共课类型 */
export type PublicExamType = "统考" | "自命题" | "未知";

/** 专业考试科目分析 */
export interface MajorExamInfo {
  major: string;
  discipline: string;        // 学科门类
  public_subjects: string[]; // 公共课（政治、英语等）
 专业课: string[];         // 专业课
  typical_score: number;     // 典型分数线
  competition_level: string; // 竞争程度
}

/**
 * 从学校专业数据中提取考试科目信息
 */
export function extractExamInfo(profiles: SchoolProfile[]): MajorExamInfo[] {
  const results: MajorExamInfo[] = [];

  for (const p of profiles) {
    if (!p.exam_subjects || p.exam_subjects.length === 0) continue;

    const publicSubjects = p.exam_subjects.filter((s) =>
      /^(政治|英语|数学|统考)/.test(s)
    );
    const majorSubjects = p.exam_subjects.filter(
      (s) => !/^(政治|英语|数学|统考)/.test(s)
    );

    results.push({
      major: p.major,
      discipline: inferDiscipline(p.major),
      public_subjects: publicSubjects,
      专业课: majorSubjects,
      typical_score: p.cutoff_score || 0,
      competition_level: inferCompetition(p),
    });
  }

  return results;
}

/**
 * 推断专业所属学科门类
 */
export function inferDiscipline(major: string): string {
  // 门类代码映射（仅最常用）
  const disciplineMap: [RegExp, string][] = [
    [/哲学/, "哲学"],
    [/经济|金融|财政|保险|贸易/, "经济学"],
    [/法学|法律|政治|社会|民族/, "法学"],
    [/教育|心理|体育/, "教育学"],
    [/文学|语言|新闻|传播|翻译/, "文学"],
    [/历史/, "历史学"],
    [/数学|物理|化学|生物|天文|地理|地质|海洋/, "理学"],
    [/工程|计算机|机械|电子|通信|自动化|土木|材料|环境|能源|航空/, "工学"],
    [/农学|林学|畜牧/, "农学"],
    [/医学|临床|护理|药学|中医|口腔/, "医学"],
    [/管理|工商|会计|市场/, "管理学"],
    [/艺术|美术|音乐|舞蹈|戏剧|设计/, "艺术学"],
    [/交叉|人工智能|数据科学/, "交叉学科"],
  ];

  for (const [pattern, discipline] of disciplineMap) {
    if (pattern.test(major)) return discipline;
  }

  return "其他";
}

/**
 * 推断竞争程度
 */
export function inferCompetition(profile: SchoolProfile): string {
  const tier = profile.school_tier || "";
  const ratio = profile.competition_ratio || "";
  const score = profile.cutoff_score || 0;

  // 高竞争：985 + 高分数线 + 高报录比
  if (tier.includes("985") && (score >= 370 || ratio.includes("10:"))) {
    return "激烈";
  }
  if (tier.includes("211") && (score >= 350 || ratio.includes("8:"))) {
    return "较激烈";
  }
  if (tier === "普通" && score < 300) {
    return "适中";
  }

  // 默认根据学校层次推断
  if (tier.includes("985")) return "激烈";
  if (tier.includes("211")) return "较激烈";
  if (tier.includes("双一流")) return "较激烈";

  return "适中";
}

/**
 * 根据专业名称获取典型考试科目建议
 * （仅在没有实际数据时作为参考提示，不编造具体数据）
 */
export function getTypicalExamSubjects(major: string, schoolTier?: string): string[] | null {
  const map: Record<string, string[]> = {
    "计算机科学与技术": ["政治", "英语一", "数学一", "408计算机学科专业基础"],
    "软件工程": ["政治", "英语一", "数学一", "软件工程专业基础"],
    "金融": ["政治", "英语二", "数学三", "431金融学综合"],
    "法学": ["政治", "英语一", "法学综合"],
    "法律": ["政治", "英语一", "法律硕士专业基础", "法律硕士综合"],
    "教育学": ["政治", "英语一", "311教育学专业基础"],
    "心理学": ["政治", "英语一", "312心理学专业基础"],
    "新闻与传播": ["政治", "英语二", "334新闻与传播专业综合", "440新闻与传播专业基础"],
    "工商管理(MBA)": ["管理类综合能力", "英语二"],
    "公共管理": ["管理类综合能力", "英语二"],
    "会计": ["管理类综合能力", "英语二"],
    "临床医学": ["政治", "英语一", "306临床医学综合能力"],
    "护理": ["政治", "英语一", "308护理综合"],
    "药学": ["政治", "英语一", "药学综合"],
    "美术": ["政治", "英语一", "美术史论", "创作"],
    "设计学": ["政治", "英语一", "设计史论", "设计基础"],
  };

  for (const [key, subjects] of Object.entries(map)) {
    if (major.includes(key)) return subjects;
  }

  return null;
}
