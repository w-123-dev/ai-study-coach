import { X, Check } from "lucide-react";

const comparisons = [
  {
    name: "自己备考",
    description: "买一堆书自己学",
    plan: false,
    track: false,
    adapt: false,
    memory: false,
    coach: false,
  },
  {
    name: "普通学习 App",
    description: "课程+题库",
    plan: true,
    track: true,
    adapt: false,
    memory: false,
    coach: false,
  },
  {
    name: "ChatGPT",
    description: "问一句答一句",
    plan: true,
    track: false,
    adapt: false,
    memory: false,
    coach: false,
  },
  {
    name: "AI 考研教练",
    description: "你的专属 AI 陪练",
    plan: true,
    track: true,
    adapt: true,
    memory: true,
    coach: true,
    highlight: true,
  },
];

const rows = [
  { key: "plan", label: "个性化学习计划" },
  { key: "track", label: "每日监督打卡" },
  { key: "adapt", label: "动态调整计划" },
  { key: "memory", label: "长期记住你" },
  { key: "coach", label: "主动教练提醒" },
];

export default function PainPoints() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            为什么需要一个专属 AI 教练？
          </h2>
          <p className="mt-3 text-sm text-white/40">
            看看不同备考方式的差距
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="w-[28%] pb-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                  能力
                </th>
                {comparisons.map((c) => (
                  <th
                    key={c.name}
                    className="pb-4 text-center"
                  >
                    <div
                      className={`mx-auto inline-block rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        c.highlight
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-white/60"
                      }`}
                    >
                      {c.name}
                    </div>
                    <div className="mt-1 text-[11px] font-normal text-white/30">
                      {c.description}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-white/5">
                  <td className="py-4 text-sm font-medium text-white/60">
                    {row.label}
                  </td>
                  {comparisons.map((c) => {
                    const val = c[row.key as keyof typeof c];
                    return (
                      <td key={c.name} className="py-4 text-center">
                        {val === true ? (
                          <Check className="mx-auto h-5 w-5 text-emerald-400" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-white/20" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
