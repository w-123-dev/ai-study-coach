import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { callDeepSeek } from "@/lib/deepseek";
import { buildCheckinPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { supabase, supabaseResponse } = createClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { studyHours, tasksCompleted, tasksTotal, status, difficulties } = body;

    if (studyHours == null || tasksCompleted == null) {
      return NextResponse.json(
        { error: "缺少必要字段" },
        { status: 400 }
      );
    }

    // 读取用户资料
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "请先填写考研信息" },
        { status: 400 }
      );
    }

    // 构建计划摘要
    let planSummary = "备考中";
    if (profile.study_plan?.stages?.[0]) {
      const first = profile.study_plan.stages[0];
      planSummary = `${first.name}：${first.focus}`;
    }

    // 生成AI反馈
    const prompt = buildCheckinPrompt(profile, {
      studyHours,
      tasksCompleted,
      tasksTotal,
      status,
      difficulties,
    }, planSummary);

    const feedback = await callDeepSeek(prompt);

    // 保存打卡记录
    const today = new Date().toISOString().split("T")[0];
    const { error: upsertError } = await supabase.from("daily_checkins").upsert(
      {
        user_id: user.id,
        checkin_date: today,
        study_hours: studyHours,
        tasks_completed: tasksCompleted,
        tasks_total: tasksTotal,
        status,
        difficulties,
        ai_feedback: feedback,
      },
      { onConflict: "user_id,checkin_date" }
    );

    if (upsertError) {
      return NextResponse.json(
        { error: "保存失败：" + upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
