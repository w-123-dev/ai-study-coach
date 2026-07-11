import Link from "next/link";
import {
  Brain,
  CalendarCheck,
  BarChart3,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";

const features = [
  {
    icon: Brain,
    title: "AI 制定计划",
    description:
      "输入你的目标院校、专业和当前水平，AI自动生成从今天到考研日的个性化学习计划，精确到每周该学什么。",
  },
  {
    icon: CalendarCheck,
    title: "每日学习监督",
    description:
      "每天打卡记录学习情况，AI根据你的完成度给出针对性反馈，帮你保持节奏不掉队。",
  },
  {
    icon: BarChart3,
    title: "学习数据分析",
    description:
      "学习进度可视化，清楚了解自己的完成趋势和薄弱环节，让每一分钟的学习都有方向。",
  },
];

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "填写信息",
    description: "告诉AI你的目标院校、考试科目和每天可用的学习时间。",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "生成计划",
    description: "AI为你量身定制学习计划，从今天安排到考研前一天。",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "每日执行",
    description: "按计划学习、每日打卡，AI全程陪伴，随时为你答疑。",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold tracking-tight text-gray-900">
              AI考研教练
            </span>
          </Link>
          <AuthButton />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-5 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              为考研学生打造
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              你的AI考研私人教练
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-500 md:text-lg md:leading-8">
              根据你的目标院校和学习情况，
              <br className="hidden sm:inline" />
              制定计划、监督执行、陪你坚持到考试。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto"
              >
                免费开始
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                了解更多
              </Link>
            </div>
          </div>
        </section>

        {/* 核心功能 */}
        <section className="border-t border-gray-100 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              核心功能
            </h2>
            <p className="mt-3 text-center text-sm text-gray-500">
              从规划到执行，AI全程陪伴你的考研之路
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 使用流程 */}
        <section id="how-it-works" className="border-t border-gray-100 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              三步开始
            </h2>
            <p className="mt-3 text-center text-sm text-gray-500">
              操作简单，几分钟就能拥有专属学习计划
            </p>
            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => (
                <div key={step.title} className="relative">
                  {/* 移动端连接线 */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-5 top-12 h-10 w-px bg-gray-200 md:hidden" />
                  )}
                  <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                      {step.number}
                    </div>
                    <div className="md:mt-4">
                      <div className="flex items-center gap-2 md:justify-center">
                        <step.icon className="h-4 w-4 text-blue-600" />
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部号召 */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              现在开始，离上岸更进一步
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              数千考研学生正在使用AI规划学习，你也可以。
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              免费注册
            </Link>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-100 px-5 py-8">
        <div className="mx-auto max-w-5xl text-center text-xs text-gray-400">
          AI考研私人教练 &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}
