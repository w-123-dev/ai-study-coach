import { NextRequest } from "next/server";
import { withAuth, getStudentProfile } from "@/lib/api-utils";
import { callDeepSeek } from "@/lib/deepseek";
import type { StudentProfile, StudyPlanStage } from "@/lib/types";

/** 诊断报告结构 */
export interface DiagnosisResult {
  /** 用户画像摘要 */
  profile_summary: string;
  /** 优势 */
  strengths: string[];
  /** 风险 */
  risks: string[];
  /** 最大问题 */
  biggest_problems: string[];
  /** 备考建议 */
  suggestions: string[];
  /** 预计备考路线（阶段概览） */
  predicted_stages: {
    name: string;
    period: string;
    focus: string;
  }[];
  /** AI 综合信心评估 0-100 */
  confidence: number;
}

const levelLabels: Record<string, string> = {
  beginner: "零基础",
  some_basis: "有一定基础",
  good_basis: "基础较好",
  advanced: "基础扎实",
};

function buildDiagnosisPrompt(profile: StudentProfile): string {
  const today = new Date();
  const examDate = new Date(profile.exam_year, 11, 21);
  const remainingDays = Math.ceil(
    (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const levelText = levelLabels[profile.level] || profile.level;
  const subjectsText = profile.subjects.join("、");
  const weakText =
    profile.weak_subjects.length > 0
      ? profile.weak_subjects.join("、")
      : "无特别薄弱科目";

  return `你是一名资深的考研诊断专家。请根据以下学生信息进行诊断分析。

## 学生信息

- 目标学校：${profile.school}
- 目标专业：${profile.major}
- 考试科目：${subjectsText}
- 当前水平：${levelText}
- 薄弱科目：${weakText}
- 每天可学习时间：${profile.daily_hours}小时
- 距离考研：约${remainingDays}天

## 诊断要求

请从以下维度进行专业分析：

1. **用户画像摘要**：一句话概括该学生的基本情况
2. **优势分析**：该学生的有利条件（列出2-3条）
3. **风险分析**：该学生可能面临的挑战（列出2-3条）
4. **最大问题**：当前最需要解决的核心问题（列出1-2条）
5. **备考建议**：基于诊断的具体建议（列出2-3条）
6. **预计备考路线**：建议的阶段性规划（基础→强化→冲刺）

## 输出规则

1. 必须输出纯 JSON，不包含 markdown 代码块标记
2. 语气专业、务实，不制造焦虑
3. 不保证录取结果
4. 基于学生实际情况给出客观分析

## 输出格式

{
  "profile_summary": "一句话用户画像",
  "strengths": ["优势1", "优势2"],
  "risks": ["风险1", "风险2"],
  "biggest_problems": ["核心问题1"],
  "suggestions": ["建议1", "建议2"],
  "predicted_stages": [
    { "name": "阶段名称", "period": "时间范围", "focus": "重点内容" }
  ],
  "confidence": 85
}`;
}

export const POST = withAuth(async (_request: NextRequest, { user, supabase }) => {
  // 读取用户资料
  const { data: profile, error: profileError } = await getStudentProfile(
    supabase,
    user.id
  );

  if (profileError || !profile) {
    return {
      error: "请先填写考研信息",
      _status: 400,
    };
  }

  // 构建诊断 prompt
  const prompt = buildDiagnosisPrompt(profile);

  // 调用 DeepSeek
  const diagnosisText = await callDeepSeek(prompt, {
    systemPrompt:
      "你是专业的考研诊断专家。只返回JSON，不要包含任何markdown格式或额外的文字说明。",
    temperature: 0.7,
    maxTokens: 2048,
  });

  // 解析 JSON
  let diagnosis: DiagnosisResult;
  try {
    diagnosis = JSON.parse(diagnosisText);
  } catch {
    return {
      error: "AI 返回格式异常，请重试",
      raw: diagnosisText,
      _status: 500,
    };
  }

  // 保存诊断结果到 student_profiles
  const { error: updateError } = await supabase
    .from("student_profiles")
    .update({ diagnosis: diagnosis })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[Diagnosis] 保存诊断结果失败:", updateError);
    // 不阻断流程，继续返回
  }

  return { diagnosis };
});
