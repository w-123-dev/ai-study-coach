/**
 * 伙伴节日/特殊事件陪伴系统
 *
 * 自动检测：
 * - 中国传统节日（中秋、春节、端午等）
 * - 公历节日（元旦、国庆等）
 * - 用户个人事件（考前倒计时等）
 *
 * 设计原则：
 * - 简短自然，像朋友随口提起
 * - 不分析、不建议、不评价
 * - 节日只问候，不庆祝
 */

/** 节日定义 */
export interface Occasion {
  /** 唯一标识 */
  id: string;
  /** 节日名称 */
  name: string;
  /** 伙伴问候语 */
  greeting: string;
  /** 类型：holiday | personal */
  type: "holiday" | "personal" | "seasonal";
  /** 日期（月-日），用于匹配 */
  dateKey: string; // "MM-DD"
  /** 年份（null=每年） */
  year?: number;
}

/**
 * 公历节日表
 * 每年固定日期
 */
const SOLAR_HOLIDAYS: Occasion[] = [
  {
    id: "new_year",
    name: "元旦",
    greeting: "新年。今年一起走完。",
    type: "holiday",
    dateKey: "01-01",
  },
  {
    id: "valentine",
    name: "情人节",
    greeting: "今天外面很热闹。你安心学你的。",
    type: "holiday",
    dateKey: "02-14",
  },
  {
    id: "labour_day",
    name: "劳动节",
    greeting: "放假了。学累了就歇会。",
    type: "holiday",
    dateKey: "05-01",
  },
  {
    id: "national_day",
    name: "国庆节",
    greeting: "假期长。按自己节奏来。",
    type: "holiday",
    dateKey: "10-01",
  },
  {
    id: "christmas",
    name: "圣诞节",
    greeting: "今天圣诞。外面热闹，你安静看书。",
    type: "holiday",
    dateKey: "12-25",
  },
];

/**
 * 农历节日表（2026-2028年）
 * 数据来源：中国法定农历节假日
 */
const LUNAR_HOLIDAYS: Record<string, Occasion[]> = {
  "2026": [
    { id: "spring_festival_2026", name: "春节", greeting: "过年了。休息几天也没关系。", type: "holiday", dateKey: "02-17", year: 2026 },
    { id: "lantern_2026", name: "元宵节", greeting: "元宵。吃完汤圆再看书。", type: "holiday", dateKey: "03-03", year: 2026 },
    { id: "qingming_2026", name: "清明节", greeting: "清明。春天了。", type: "holiday", dateKey: "04-04", year: 2026 },
    { id: "dragon_boat_2026", name: "端午节", greeting: "端午。吃个粽子再看书。", type: "holiday", dateKey: "06-19", year: 2026 },
    { id: "mid_autumn_2026", name: "中秋节", greeting: "中秋。今天别忘了休息一下。", type: "holiday", dateKey: "09-27", year: 2026 },
    { id: "double_ninth_2026", name: "重阳节", greeting: "重阳。秋天了。时间过得快。", type: "holiday", dateKey: "10-18", year: 2026 },
  ],
  "2027": [
    { id: "spring_festival_2027", name: "春节", greeting: "又一年。你在，我也在。", type: "holiday", dateKey: "02-06", year: 2027 },
    { id: "lantern_2027", name: "元宵节", greeting: "元宵。年后第一次月圆。", type: "holiday", dateKey: "02-20", year: 2027 },
    { id: "qingming_2027", name: "清明节", greeting: "清明。春日渐暖。", type: "holiday", dateKey: "04-05", year: 2027 },
    { id: "dragon_boat_2027", name: "端午节", greeting: "端午。夏天了。", type: "holiday", dateKey: "06-08", year: 2027 },
    { id: "mid_autumn_2027", name: "中秋节", greeting: "中秋。月亮很圆。", type: "holiday", dateKey: "09-15", year: 2027 },
    { id: "double_ninth_2027", name: "重阳节", greeting: "重阳。秋天过半了。", type: "holiday", dateKey: "10-08", year: 2027 },
  ],
  "2028": [
    { id: "spring_festival_2028", name: "春节", greeting: "春节。休息是为了走更远。", type: "holiday", dateKey: "01-26", year: 2028 },
    { id: "lantern_2028", name: "元宵节", greeting: "元宵。年过完了，该收心了。", type: "holiday", dateKey: "02-09", year: 2028 },
    { id: "qingming_2028", name: "清明节", greeting: "清明。万物生长。", type: "holiday", dateKey: "04-04", year: 2028 },
    { id: "mid_autumn_2028", name: "中秋节", greeting: "中秋。今晚的月亮属于你。", type: "holiday", dateKey: "09-03", year: 2028 },
  ],
};

/** 季节变化 */
const SEASONAL_EVENTS: Occasion[] = [
  {
    id: "begin_spring",
    name: "立春",
    greeting: "立春。春天要来了。",
    type: "seasonal",
    dateKey: "02-04",
  },
  {
    id: "begin_summer",
    name: "立夏",
    greeting: "立夏。天要热了，注意休息。",
    type: "seasonal",
    dateKey: "05-05",
  },
  {
    id: "begin_autumn",
    name: "立秋",
    greeting: "立秋。秋天是备考的季节。",
    type: "seasonal",
    dateKey: "08-07",
  },
  {
    id: "begin_winter",
    name: "立冬",
    greeting: "立冬。冬天要来了，注意保暖。",
    type: "seasonal",
    dateKey: "11-07",
  },
];

/**
 * 检测今天是否为特殊节日/事件
 * 返回匹配的节日问候，多个则合并
 */
export function detectOccasion(): Occasion | null {
  const now = new Date();
  const todayKey = getDateKey(now);
  const year = now.getFullYear().toString();

  // 1. 检测公历节日
  for (const holiday of SOLAR_HOLIDAYS) {
    if (holiday.dateKey === todayKey) return holiday;
  }

  // 2. 检测农历节日
  const yearHolidays = LUNAR_HOLIDAYS[year];
  if (yearHolidays) {
    for (const holiday of yearHolidays) {
      if (holiday.dateKey === todayKey) return holiday;
    }
  }

  // 3. 检测季节变化
  for (const event of SEASONAL_EVENTS) {
    if (event.dateKey === todayKey) return event;
  }

  return null;
}

/**
 * 检测用户个人事件（考前倒计时）
 * 需要 exam_year 信息
 */
export function detectPersonalEvent(examYear?: number | null): Occasion | null {
  if (!examYear) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 考研通常在12月倒数第一个周末
  // 估算考试日期：examYear年12月倒数第一个周六
  const examDate = getEstimatedExamDate(examYear);
  if (!examDate) return null;

  const diffDays = Math.floor(
    (examDate.getTime() - today.getTime()) / 86400000
  );

  if (diffDays < 0) return null; // 已过考试

  if (diffDays === 0) {
    return {
      id: "exam_day",
      name: "考试当天",
      greeting: "今天考试。去吧。",
      type: "personal",
      dateKey: getDateKey(now),
    };
  }

  if (diffDays === 30) {
    return {
      id: "exam_30",
      name: "考前30天",
      greeting: "最后30天。我们一起走。",
      type: "personal",
      dateKey: getDateKey(now),
    };
  }

  if (diffDays === 7) {
    return {
      id: "exam_7",
      name: "考前7天",
      greeting: "最后一周。调整好状态。",
      type: "personal",
      dateKey: getDateKey(now),
    };
  }

  if (diffDays === 100) {
    return {
      id: "exam_100",
      name: "考前100天",
      greeting: "100天。还来得及。",
      type: "personal",
      dateKey: getDateKey(now),
    };
  }

  return null;
}

/**
 * 获取完整节日上下文（含个人事件）
 * 用于注入到伙伴对话
 */
export async function getOccasionContext(
  userId: string,
  supabase: any
): Promise<string> {
  const now = new Date();

  // 检测节日
  const holiday = detectOccasion();

  // 检测个人事件
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("exam_year")
    .eq("user_id", userId)
    .single();

  const personalEvent = detectPersonalEvent(profile?.exam_year);

  // 合并返回
  const occasions: string[] = [];

  if (holiday) {
    occasions.push(holiday.greeting);
  }

  if (personalEvent) {
    occasions.push(personalEvent.greeting);
  }

  if (occasions.length === 0) return "";

  return `【今天特殊日子】\n${occasions.join("\n")}`;
}

/**
 * 获取欢迎语中的节日问候（简短版，用于前端展示）
 */
export function getOccasionGreeting(profile?: { exam_year?: number | null }): string | null {
  const holiday = detectOccasion();
  if (holiday) return holiday.greeting;

  const personalEvent = detectPersonalEvent(profile?.exam_year);
  if (personalEvent) return personalEvent.greeting;

  return null;
}

/** 格式化日期为 MM-DD */
function getDateKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}

/**
 * 估算考研日期
 * 考研通常在12月倒数第一个周六（或最后一个完整周周末）
 * 简单估算：12月21日左右（实际每年不同，但足够精确）
 */
function getEstimatedExamDate(year: number): Date {
  // 通常考研在12月21-27日之间的周六
  // 大致估算为12月的第4个周六
  const decFirst = new Date(year, 11, 1);
  const dayOfWeek = decFirst.getDay(); // 0=Sun, 1=Mon...
  // 找到第一个周六
  const firstSat = dayOfWeek <= 6 ? (6 - dayOfWeek + 1) : 1;
  // 第4个周六 ≈ 12月21日左右
  const examDay = firstSat + 21; // 第4个周六附近
  return new Date(year, 11, Math.min(examDay, 25));
}
