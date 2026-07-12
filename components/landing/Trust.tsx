import { Shield, Database, Cpu, Lock, FileCheck, Globe } from "lucide-react";

const badges = [
  {
    icon: Database,
    title: "研招网权威数据",
    description: "院校信息基于研招网公开数据，确保计划真实可靠。",
  },
  {
    icon: Cpu,
    title: "DeepSeek AI 驱动",
    description: "采用先进 AI 模型，提供专业的考研规划建议。",
  },
  {
    icon: Shield,
    title: "数据加密存储",
    description: "学习数据加密存储，隐私安全有保障。",
  },
  {
    icon: FileCheck,
    title: "持续更新",
    description: "院校分数线、考试科目等数据定期更新。",
  },
];

export default function Trust() {
  return (
    <section className="border-t border-gray-100 bg-[#0F172A] px-5 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white/80">
            值得信赖的 AI 考研伙伴
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <badge.icon className="h-5 w-5 text-white/60" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white/80">
                {badge.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
