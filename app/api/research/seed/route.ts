/**
 * 院校信息种子数据 API
 *
 * POST /api/research/seed
 * 需要 service_role key，仅在服务端可用
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_SCHOOL_PROFILES } from "@/lib/research/seed-data";

// 使用 service_role 创建管理端客户端
const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(_request: NextRequest) {
  try {
    let inserted = 0;
    let skipped = 0;

    for (const record of SEED_SCHOOL_PROFILES) {
      // 检查是否已存在
      const { data: existing } = await serviceSupabase
        .from("school_profiles")
        .select("id")
        .eq("school", record.school)
        .eq("major", record.major)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const { error } = await serviceSupabase
        .from("school_profiles")
        .insert({
          school: record.school,
          major: record.major,
          exam_subjects: record.exam_subjects,
          cutoff_score: record.cutoff_score,
          school_tier: record.school_tier,
          major_ranking: record.major_ranking,
          verified: true,
          data_source: "研招网公开数据",
          notes:
            record.exam_subjects.length > 0
              ? `初试科目：${record.exam_subjects.join("、")}`
              : null,
        });

      if (error) {
        console.error(`[Seed] 插入失败 ${record.school} ${record.major}:`, error.message);
      } else {
        inserted++;
      }
    }

    return NextResponse.json({
      message: `写入完成，新增 ${inserted} 条，跳过 ${skipped} 条（已存在）`,
      inserted,
      skipped,
      total: SEED_SCHOOL_PROFILES.length,
    });
  } catch (err) {
    console.error("[Seed] 种子数据写入失败:", err);
    return NextResponse.json(
      { error: "种子数据写入失败: " + (err instanceof Error ? err.message : "未知错误") },
      { status: 500 }
    );
  }
}
