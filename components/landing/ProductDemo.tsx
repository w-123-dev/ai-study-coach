import {
  Brain,
  BarChart3,
  Bell,
  RefreshCw,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "AI 长期记忆",
    description: "AI 记得你的目标、薄弱科目、学习习惯。每次对话都知道你是谁、学到哪了。",
    badge: "核心能力",
  },
  {
    icon: BarChart3,
    title: "学习数据分析",
    description: "完成率、各科时间分布、效率趋势一目了然。知道自己哪里强、哪里弱。",
    badge: "数据驱动",
  },
  {
    icon: Bell,
    title: "主动教练提醒",
    description: "连续未学习、完成率下降、某科停滞——AI 主动发现并帮你调整。",
    badge: "主动陪伴",
  },
  {
    icon: RefreshCw,
    title: "动态调整计划",
    description: "计划不是死的。AI 根据每周完成情况，自动调整下周的安排。",
    badge: "灵活适应",
  },
  {
    icon: MessageSquare,
    title: "随时 AI 对话",
    description: "不会的题、看不懂的知识点、心态焦虑——随时问，随时有回应。",
    badge: "即时反馈",
  },
  {
    icon: Sparkles,
    title: "个性化教练模式",
    description: "严格监督、温和陪伴、数据分析、冲刺强化——选择最适合你的教练风格。",
    badge: "千人千面",
  },
];

export default function ProductDemo() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            AI 教练的核心能力
          </h2>
          <p className="mt-3 text-sm text-white/40">
            不是简单的聊天机器人，是你专属的备考陪练
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <cap.icon className="h-5 w-5 text-blue-400" />
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
                  {cap.badge}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
