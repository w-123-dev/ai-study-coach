# AI 考研教练 — 项目架构文档

> 项目路径：`D:\ai-study-coach`
> 技术栈：Next.js 16 + Supabase + DeepSeek
> 部署平台：Vercel + Supabase Cloud
> 当前版本：V2.0

---

## 一、项目目录结构

```
D:\ai-study-coach/
├── app/                          # Next.js App Router 页面
│   ├── page.tsx                  # Landing Page（V4 深色主题）
│   ├── layout.tsx                # 全局布局
│   ├── welcome/page.tsx          # 欢迎引导页（首次注册进入）
│   ├── signup/page.tsx           # 注册页
│   ├── login/page.tsx            # 登录页
│   ├── verify-email/page.tsx     # 邮箱验证提示页
│   ├── setup/page.tsx            # 信息填写（分3步：基础/学习/困难）
│   ├── diagnosis/page.tsx        # AI 诊断页（填写后 AI 分析生成报告）
│   ├── plan-success/page.tsx     # 计划生成成功页（展示路线 + 第一个任务）
│   ├── dashboard/page.tsx        # 用户主面板（今日任务/进度/AI建议/伙伴）
│   ├── profile-check/page.tsx    # 信息二次确认页（AI 校验用户输入）
│   ├── report/page.tsx           # 学习周报页
│   ├── chat/page.tsx             # AI 聊天页
│   └── api/                      # 后端 API 路由
│       ├── auth/confirm/route.ts # 认证确认
│       ├── chat/send/route.ts    # AI 聊天
│       ├── checkin/generate/route.ts  # 每日打卡
│       ├── plan/
│       │   ├── generate/route.ts # 计划生成
│       │   ├── review/route.ts   # 计划复盘
│       │   └── tasks/route.ts    # 任务管理
│       ├── analysis/
│       │   ├── state/route.ts    # 学生状态分析
│       │   └── weekly-report/route.ts  # 周报
│       ├── coach/
│       │   ├── detect/route.ts   # 主动提醒检测
│       │   └── messages/route.ts # 教练消息
│       ├── diagnosis/route.ts    # AI 诊断
│       ├── research/seed/route.ts # 院校数据填充
│       └── partner/
│           ├── state/route.ts    # 伙伴状态
│           ├── interact/route.ts # 伙伴聊天
│           ├── focus/start/route.ts  # 专注开始
│           ├── focus/end/route.ts    # 专注结束
│           ├── logs/route.ts     # 伙伴观察日志
│           └── space/route.ts    # 伙伴空间
│
├── components/                   # React 组件
│   ├── landing/                  # Landing Page 组件
│   │   ├── Hero.tsx              # 首屏（含 ProductHeroMockup）
│   │   ├── ProductHeroMockup.tsx # 产品 Mockup（玻璃拟态窗口）
│   │   ├── CoachDifference.tsx   # 对比故事卡片（替代旧 compare table）
│   │   ├── CoachFlow.tsx         # 教练工作流程
│   │   ├── ProductDemo.tsx       # 产品展示
│   │   ├── GrowthTimeline.tsx    # 长期陪伴时间线
│   │   ├── Trust.tsx             # 信任背书
│   │   └── CTA.tsx               # 底部行动号召
│   ├── partner/                  # AI 伙伴系统组件
│   │   ├── PartnerCard.tsx       # 伙伴信息卡片
│   │   ├── PartnerAvatar.tsx     # 动态 SVG 伙伴头像
│   │   ├── PartnerChat.tsx       # 伙伴侧边聊天
│   │   ├── PartnerLogs.tsx       # 伙伴观察日志
│   │   ├── FocusMode.tsx         # 番茄钟专注模式
│   │   └── StudySpace.tsx        # 伙伴学习空间
│   └── AuthButton.tsx            # 认证按钮组件
│
├── lib/                          # 核心业务逻辑
│   ├── supabase.ts               # Supabase 客户端
│   ├── supabase-server.ts        # Supabase 服务端
│   ├── deepseek.ts               # DeepSeek API 封装
│   ├── prompts.ts                # AI Prompt 模板
│   ├── types.ts                  # TypeScript 类型定义
│   ├── api-utils.ts              # API 工具函数
│   ├── profile/                  # 用户画像系统
│   │   ├── profile-validator.ts  # 用户输入校验
│   │   └── snapshot-service.ts   # 每日快照服务
│   ├── memory/                   # AI 记忆系统
│   │   ├── memory-manager.ts     # 记忆管理器
│   │   ├── context-builder.ts    # 对话上下文构建
│   │   ├── session-manager.ts    # 会话管理
│   │   ├── chat-extractor.ts     # 聊天信息提取
│   │   ├── profile-initializer.ts # 画像初始化
│   │   └── coach-personality.ts  # 教练人格系统
│   ├── plan/                     # 学习计划系统
│   │   ├── plan-task-service.ts  # 任务管理服务
│   │   └── plan-review.ts        # 每周复盘逻辑
│   ├── analysis/                 # 数据分析系统
│   │   ├── student-state.ts      # 学生状态分析
│   │   ├── coach-detector.ts     # 教练提醒检测器
│   │   └── weekly-report.ts      # 周报生成
│   ├── research/                 # 院校检索系统
│   │   ├── school-search.ts      # 院校搜索
│   │   ├── major-search.ts       # 专业搜索
│   │   ├── research-cache.ts     # 搜索缓存
│   │   └── seed-data.ts          # 初始数据
│   ├── partner/                  # AI 伙伴系统
│   │   ├── partner-service.ts    # 伙伴服务
│   │   ├── partner-prompt.ts     # 伙伴 Prompt
│   │   ├── personality.ts        # 伙伴人格
│   │   ├── behavior.ts           # 伙伴行为状态机
│   │   ├── memory.ts             # 伙伴记忆
│   │   ├── logs.ts               # 伙伴观察日志
│   │   ├── space.ts              # 伙伴空间
│   │   └── types.ts              # 伙伴类型
│   └── dashboard/
│       └── environment.ts        # Dashboard 环境系统
│
├── public/                       # 静态资源
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── supabase/
│   └── migrations/               # 数据库迁移文件
│       ├── 002_memory_system.sql
│       ├── 003_reminders.sql
│       ├── 004_plan_tasks.sql
│       ├── 005_checkin_upgrade.sql
│       ├── 006_student_state.sql
│       ├── 007_plan_review.sql
│       ├── 008_coach_messages.sql
│       ├── 009_school_profiles.sql
│       ├── 010_diagnosis.sql
│       ├── 011_partner_system.sql
│       ├── 012_partner_redesign.sql
│       ├── 013_partner_personality.sql
│       ├── 014_partner_space.sql
│       ├── 016_short_term_memory.sql
│       └── 015_partner_logs.sql
│
├── scripts/
│   └── seed-local.mjs            # 本地数据种子脚本
│
├── docs/                         # 项目文档
│   ├── product-position.md       # 产品定位
│   ├── roadmap.md                # 路线图
│   ├── feature-priority.md       # 功能优先级
│   └── project-architecture.md   # 本文件 - 项目架构
│
├── middleware.ts                  # Next.js 中间件（路由保护）
├── package.json                  # 依赖管理
└── .env.local                    # 环境变量
```

---

## 二、用户流程

```
Landing Page (app/page.tsx)
    │
    ▼
注册 (signup/page.tsx)
    │
    ▼
欢迎页 (welcome/page.tsx)  ← 展示产品价值
    │
    ▼
信息填写 (setup/page.tsx)
    ├─ Step 1: 基础信息（年份/学校/专业）
    ├─ Step 2: 学习情况（基础/每日时间）
    └─ Step 3: 困难（薄弱科目/最大问题）
    │
    ▼
诊断页 (diagnosis/page.tsx)  ← AI 分析用户画像
    │
    ▼
计划成功 (plan-success/page.tsx)  ← 点击"开始生成"→AI 生成→展示路线+第一个任务
    │
    ▼
Dashboard (dashboard/page.tsx)  ← 日常使用核心页面
    ├─ 今日任务（从 plan_tasks 读取）
    ├─ AI 教练建议
    ├─ 本周进度
    ├─ 倒计时
    └─ 伙伴模块
        ├─ 伙伴卡片
        ├─ 侧边聊天
        ├─ 专注模式
        └─ 观察日志
```

---

## 三、数据库表结构

| 表名 | 用途 | 迁移文件 |
|------|------|---------|
| `student_profiles` | 用户基本信息 + 学习计划 JSON（原始） | 初始 |
| `user_memory` | AI 长期记忆（目标/习惯/薄弱/性格） | 002 |
| `session_summaries` | Chat 会话摘要 | 002 |
| `reminders` | 提醒通知 | 003 |
| `plan_tasks` | 学习任务追踪（核心） | 004 |
| `daily_checkins` | 每日打卡（升级版含情绪/精力） | 005 |
| `daily_snapshots` | 每日学习快照 | 005 |
| `student_state` | 学生状态分析 | 006 |
| `plan_reviews` | 每周复盘记录 | 007 |
| `coach_messages` | 主动教练消息 | 008 |
| `school_profiles` | 院校专业信息 | 009 |
| `diagnosis_results` | 诊断报告 | 010 |
| `user_partner` | AI 伙伴用户数据 | 011 |
| `focus_sessions` | 专注模式记录 | 012 |
| `partner_memory` | 伙伴记忆 | 013 |
| `partner_logs` | 伙伴观察日志 | 015 |

---

## 四、核心模块说明

### 4.1 Landing Page (V4)
- 深色科技风 (`bg-[#0F172A]`)
- 7 个组件：Hero → CoachDifference → CoachFlow → ProductDemo → GrowthTimeline → Trust → CTA
- Hero 右侧包含高保真产品 Mockup（玻璃拟态浏览器窗口）
- CoachDifference 替代传统对比表，采用故事卡片形式

### 4.2 用户画像系统 (lib/profile/)
- `profile-validator.ts`：检测学校真实性、专业合理性、时间合理性、基础匹配度
- `snapshot-service.ts`：每日自动生成学习快照（情绪/精力/完成率）

### 4.3 AI 记忆系统 (lib/memory/)
- `memory-manager.ts`：管理 UserMemory 的 CRUD
- `context-builder.ts`：构建 AI 对话上下文（注入记忆+状态+任务）
- `session-manager.ts`：聊天结束时自动生成 SessionSummary
- `chat-extractor.ts`：从聊天中提取用户信息
- `coach-personality.ts`：4 种教练人格（严格/温和/数据/冲刺）

### 4.4 学习计划系统 (lib/plan/)
- `plan-task-service.ts`：任务 CRUD、状态更新、拆分计划
- `plan-review.ts`：每周复盘（AI 分析完成率 → 生成调整建议）

### 4.5 数据分析系统 (lib/analysis/)
- `student-state.ts`：计算学习动力/完成趋势/风险等级/压力状态
- `coach-detector.ts`：检测异常（连续未学习/完成率下降/科目停滞/长期焦虑）
- `weekly-report.ts`：生成学习周报

### 4.6 AI 伙伴系统 (lib/partner/)
- `partner-service.ts`：伙伴状态管理（exp/level/mood/energy）
- `partner-prompt.ts`：伙伴人格 Prompt（朋友型陪伴，非教练）
- `personality.ts`：固定性格系统（口头禅/表达习惯）
- `behavior.ts`：行为状态机（Idle/Reading/Thinking等）
- `memory.ts`：伙伴记忆
- `logs.ts`：观察日志生成
- `space.ts`：学习空间状态

### 4.7 院校检索系统 (lib/research/)
- `school-search.ts`：院校搜索
- `major-search.ts`：专业搜索
- `research-cache.ts`：缓存层
- `seed-data.ts`：初始种子数据

### 4.8 Dashboard 环境系统
- `lib/dashboard/environment.ts`：根据时间/日期/距离考试生成欢迎语

---

## 五、API 接口列表

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/auth/confirm` | GET/POST | 邮箱认证确认 |
| `/api/chat/send` | POST | AI 聊天 |
| `/api/plan/generate` | POST | 生成学习计划 |
| `/api/plan/tasks` | GET/PATCH | 任务查询/更新 |
| `/api/plan/review` | POST | 每周复盘 |
| `/api/checkin/generate` | POST | 生成打卡 |
| `/api/analysis/state` | GET | 获取学生状态 |
| `/api/analysis/weekly-report` | GET | 获取周报 |
| `/api/coach/detect` | POST | 检测异常触发提醒 |
| `/api/coach/messages` | GET | 获取教练消息 |
| `/api/diagnosis` | POST | AI 诊断 |
| `/api/research/seed` | POST | 填充院校数据 |
| `/api/partner/state` | GET/POST | 伙伴状态 |
| `/api/partner/interact` | POST | 伙伴聊天 |
| `/api/partner/focus/start` | POST | 开启专注 |
| `/api/partner/focus/end` | POST | 结束专注 |
| `/api/partner/logs` | GET | 伙伴日志 |
| `/api/partner/space` | GET/POST | 伙伴空间 |

---

## 六、环境变量

| 变量名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |

---

## 七、关键设计决策

1. **数据库优先**：所有状态变化都通过数据库记录，不依赖内存
2. **AI 建议不可直接修改数据库**：AI 生成建议 → 系统验证 → 人工确认 → 应用
3. **分层记忆**：UserMemory（长期）→ SessionSummary（中期）→ DailySnapshot（短期）
4. **新用户保护**：注册 7 天内不触发任何异常提醒
5. **伙伴不制造压力**：伙伴等级只升不降，不因用户不学习产生负面状态
6. **教练与伙伴分离**：AI 教练负责学习规划/分析/提醒，AI 伙伴负责陪伴/情绪支持

---

## 八、部署说明

- **前端**：Vercel (Production + Preview)
- **数据库**：Supabase Cloud
- **AI**：DeepSeek API
- **推送流程**：`git add -A` → `git commit -m "msg"` → `git push origin main` → Vercel 自动部署
- **数据库迁移**：复制 `supabase/migrations/*.sql` 到 Supabase SQL Editor 执行
