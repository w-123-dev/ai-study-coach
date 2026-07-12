import { X, Check, Minus } from "lucide-react";

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
    <section className="border-t border-gray-100 bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            为什么需要一个专属 AI 教练？
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            看看不同备考方式的差距
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="w-[28%] pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  能力
                </th>
                {comparisons.map((c) => (
                  <th
                    key={c.name}
                    className={`pb-4 text-center text-sm font-semibold ${
                      c.highlight ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    <div
                      className={`mx-auto inline-block rounded-lg px-3 py-1.5 ${
                        c.highlight
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {c.name}
                    </div>
                    <div className="mt-1 text-[11px] font-normal text-gray-400">
                      {c.description}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-gray-100">
                  <td className="py-4 text-sm font-medium text-gray-700">
                    {row.label}
                  </td>
                  {comparisons.map((c) => {
                    const val = c[row.key as keyof typeof c];
                    return (
                      <td key={c.name} className="py-4 text-center">
                        {val === true ? (
                          <Check className="mx-auto h-5 w-5 text-emerald-500" />
                        ) : val === false ? (
                          <X className="mx-auto h-5 w-5 text-gray-300" />
                        ) : (
                          <Minus className="mx-auto h-5 w-5 text-gray-300" />
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
