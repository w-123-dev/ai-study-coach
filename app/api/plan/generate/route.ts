import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { callDeepSeek } from "@/lib/deepseek";
import { buildPlanPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { supabase, supabaseResponse } = createClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 读取用户资料
    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "请先填写考研信息" },
        { status: 400 }
      );
    }

    // 构建提示词并调用 DeepSeek
    const prompt = buildPlanPrompt(profile);
    const planText = await callDeepSeek(prompt);

    // 尝试解析 JSON，确保返回的是有效 JSON
    let planJson: unknown;
    try {
      planJson = JSON.parse(planText);
    } catch {
      return NextResponse.json(
        { error: "AI返回格式异常，请重试", raw: planText },
        { status: 500 }
      );
    }

    // 保存到数据库
    const { error: updateError } = await supabase
      .from("student_profiles")
      .update({ study_plan: planJson })
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "保存计划失败：" + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: planJson });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
