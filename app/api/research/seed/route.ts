/**
 * 院校信息种子数据 API
 *
 * POST /api/research/seed
 * 使用新的 secret API key（非 JWT 格式）
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SEED_SCHOOL_PROFILES } from "@/lib/research/seed-data";

export async function POST(_request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY 未设置" },
      { status: 500 }
    );
  }

  try {
    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    // 使用 fetch 直接调用 Supabase REST API
    // 新格式 API key 需要用 Authorization: Bearer 头
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    for (const record of SEED_SCHOOL_PROFILES) {
      // 检查是否已存在
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/school_profiles?school=eq.${encodeURIComponent(record.school)}&major=eq.${encodeURIComponent(record.major)}&select=id&limit=1`,
        {
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      );

      if (!checkRes.ok) {
        const checkText = await checkRes.text();
        errors.push(`查询失败 ${record.school} ${record.major}: ${checkText}`);
        continue;
      }

      const existing = await checkRes.json();
      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      // 插入
      const insertRes = await fetch(
        `${SUPABASE_URL}/rest/v1/school_profiles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            school: record.school,
            major: record.major,
            exam_subjects: record.exam_subjects,
            cutoff_score: record.cutoff_score,
            school_tier: record.school_tier,
            major_ranking: record.major_ranking,
            verified: true,
            data_source: "研招网公开数据",
          }),
        }
      );

      if (!insertRes.ok) {
        const insertText = await insertRes.text();
        errors.push(`插入失败 ${record.school} ${record.major}: ${insertText}`);
      } else {
        inserted++;
      }
    }

    return NextResponse.json({
      message: `写入完成，新增${inserted}条，跳过${skipped}条`,
      inserted,
      skipped,
      errors: errors.slice(0, 10),
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
