# AI 考研教练 — 产品路线图

## 已完成（V2.0）

### 第一阶段：架构与数据基础设施
- [x] plan_tasks 表（任务追踪数据库）
- [x] 计划生成 → 分解 → 保存流程
- [x] Dashboard 读取 plan_tasks 替代原始 JSON
- [x] 完成任务 API（PATCH /api/plan/tasks）

### 第二阶段：学习反馈系统
- [x] daily_checkins 升级（情绪、精力、任务级记录）
- [x] DailySnapshot 自动生成
- [x] 打卡后 AI 反馈（DeepSeek 分析）
- [x] 连续打卡 streak 记录

### 第三阶段：AI 记忆系统
- [x] UserMemory 表（长期目标/习惯/薄弱科目/性格）
- [x] SessionSummary（每次聊天自动总结）
- [x] 聊天时注入记忆上下文到 Prompt
- [x] 四种记忆分类（goal/habit/weakness/personality）

### 第四阶段：状态分析系统
- [x] StudentState 模型（动力/趋势/风险/压力）
- [x] 基于 DailySnapshot + plan_tasks + UserMemory 分析
- [x] 状态报告 API

### 第五阶段：动态计划调整
- [x] 每周自动复盘（AI 分析完成率 + 问题 + 建议）
- [x] 系统验证机制（AI 建议 → 人工确认 → 应用）
- [x] 保留历史版本（new_version 字段）

### 第六阶段：主动教练系统
- [x] coach_messages 表 + 检测逻辑
- [x] 4 种检测：连续未学习 / 完成率下降 / 某科停滞 / 长期焦虑
- [x] 新用户保护（注册 >7 天 + 有真实记录才触发）
- [x] Dashboard 展示教练消息 + 一键忽略

### 第七阶段：前端体验优化
- [x] Landing Page 7 组件（Hero/PainPoints/CoachFlow/ProductDemo/GrowthTimeline/Trust/CTA）
- [x] 全深色主题统一（bg-[#0F172A]）
- [x] Welcome 引导页
- [x] Setup 分 3 步填写（基础/学习/困难）
- [x] Plan Success 页（生成前需点击「开始生成」）
- [x] 首次进入 Dashboard 任务折叠
- [x] 倒计时 + 今日任务 + AI 建议 + 本周进度

### 数据库迁移清单
| 迁移文件 | 功能 |
|---------|------|
| 002_memory_system.sql | UserMemory + SessionSummary |
| 003_reminders.sql | Reminders 通知表 |
| 004_plan_tasks.sql | PlanTask 任务追踪 |
| 005_checkin_upgrade.sql | 打卡升级 + DailySnapshot |
| 006_student_state.sql | StudentState 状态分析 |
| 007_plan_review.sql | PlanReview 每周复盘 |
| 008_coach_messages.sql | CoachMessage 主动提醒 |
| 009_school_profiles.sql | 院校信息数据库 |

## 下一阶段（V2.1 — 体验打磨）

- [ ] 用户信息验证（学校真实性 / 专业跨度过大 / 时间合理性检测）
- [ ] 院校检索模块（research-cache 缓存层）
- [ ] 自动填充院校信息（基于 seed 数据 + 用户输入）
- [ ] Profile Check 确认页（AI 二次确认）

## 中期（V2.2 — 增长引擎）

- [ ] 学习周报页面（Weekly Report + AI 总结）
- [ ] 邮件/App 推送提醒（站外触达）
- [ ] 分享计划到社交媒体（增长裂变）
- [ ] 推荐系统：每日一句 + 学习 tips

## 远期（V3.0 — 商业化）

- [ ] 免费 / 会员分层
  - 免费：基础计划、每日打卡、有限次 AI 对话
  - 会员：所有教练模式、无限对话、数据分析、优先响应
- [ ] 支付系统接入
- [ ] 教练人格切换 UI（严格/温和/数据/冲刺）
- [ ] 多人教练模式（不同科目不同教练风格）
- [ ] 小程序 / 移动端适配
