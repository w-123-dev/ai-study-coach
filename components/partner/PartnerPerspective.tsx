"use client";

import { Smile, Meh, Frown, AlertCircle, Sparkles } from "lucide-react";
import type { WeeklyReportData } from "@/lib/analysis/weekly-report";

function getCompanionMessage(report: WeeklyReportData): {
  emoji: string;
  title: string;
  message: string;
} {
  const { totalHours, avgCompletionRate, studyDays, streakDays, moodStats, subjects, aiProblems } = report;

  // 情绪主导
  const anxiousDays = moodStats.anxious || 0;
  const tiredDays = moodStats.tired || 0;
  const happyDays = moodStats.happy || 0;
  const totalMoodDays = Object.values(moodStats).reduce((a, b) => a + b, 0);

  // 完成率判断
  if (avgCompletionRate >= 80 && streakDays >= 5) {
    return {
      emoji: "🌟",
      title: "这一周很精彩",
      message: `${streakDays}天连续学习，完成率${avgCompletionRate}%。小伴觉得你状态很好，继续保持这个节奏。累了就歇，别太勉强自己。`,
    };
  }

  if (avgCompletionRate < 40) {
    return {
      emoji: "💪",
      title: "这一周不太容易",
      message: `完成率只有${avgCompletionRate}%，但小伴注意到你还在坚持。考研的路就是这样，有时候走不动是正常的。明天重新开始就好。`,
    };
  }

  if (anxiousDays > tiredDays && anxiousDays > happyDays) {
    return {
      emoji: "🤗",
      title: "好像有点焦虑",
      message: `这周你有${anxiousDays}天感觉焦虑。备考压力大是正常的，小伴觉得你能走这么久已经很了不起了。别忘了休息。`,
    };
  }

  if (tiredDays > 3) {
    return {
      emoji: "☕",
      title: "这周累坏了吧",
      message: `${tiredDays}天都感觉很疲惫。小伴建议你今晚好好睡一觉，明天的事明天再说。身体比进度更重要。`,
    };
  }

  if (totalHours > 30) {
    return {
      emoji: "👏",
      title: "真的在努力",
      message: `这周学了${totalHours}个小时，小伴都看在眼里。不用总是冲在最前面，偶尔慢下来也没关系。`,
    };
  }

  if (aiProblems.length > 0) {
    return {
      emoji: "🌱",
      title: "有些问题出现了",
      message: `教练发现了一些需要调整的地方。小伴觉得发现问题就是进步的开始，别灰心，一步一步来。`,
    };
  }

  if (studyDays > 0 && studyDays < 3) {
    return {
      emoji: "🌅",
      title: "刚刚开始",
      message: `这周学习了${studyDays}天。小伴觉得能迈出第一步就很棒了，下周继续慢慢来就好。`,
    };
  }

  return {
    emoji: "✨",
    title: "新的一周",
    message: `${totalHours}小时的学习时间，${studyDays}天的坚持。小伴会一直在旁边看着你。下周也一起加油。`,
  };
}

export default function PartnerPerspective({
  report,
}: {
  report: WeeklyReportData;
}) {
  if (!report) return null;

  const { emoji, title, message } = getCompanionMessage(report);

  return (
    <section className="rounded-xl border border-white/[0.04] bg-gradient-to-br from-[#1a1f36] to-[#111827] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{emoji}</span>
        <span className="text-xs font-semibold text-white/80">小伴的视角</span>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{message}</p>
    </section>
  );
}
