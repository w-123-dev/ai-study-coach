/**
 * 用户画像验证层
 *
 * 目标：检测用户填写信息的合理性，避免基于不准确/虚假信息生成学习计划。
 * 原则：不阻止用户，只给出提示和建议。
 */

// ===== 类型定义 =====

export interface ValidationInput {
  target_school: string;
  target_major: string;
  exam_year: number;
  /** 教育背景描述，如 "本科计算机"、"专科"、"零基础跨考" */
  education_background: string;
  weak_subjects: string[];
  daily_hours: number;
  /** 考试科目列表 */
  subjects?: string[];
}

export interface ValidationWarning {
  field: string;
  type: "error" | "risk" | "suggestion";
  title: string;
  message: string;
  suggestion: string;
}

export interface ValidationResult {
  valid: boolean;
  /** 整体可信度 0-100 */
  confidence: number;
  warnings: ValidationWarning[];
}

// ===== 中国常见高校关键词（用于学校名校检测） =====

const UNI_SUFFIXES = ["大学", "学院", "研究院", "研究学院", "学校", "分校", "校区"];

/** 国内知名高校列表（筛选常见考研目标） */
const KNOWN_UNIVERSITIES = [
  "北京大学", "清华大学", "复旦大学", "上海交通大学", "浙江大学", "南京大学",
  "中国科学技术大学", "中国人民大学", "北京航空航天大学", "北京理工大学",
  "南开大学", "天津大学", "哈尔滨工业大学", "西安交通大学", "西北工业大学",
  "中山大学", "华南理工大学", "武汉大学", "华中科技大学", "四川大学",
  "电子科技大学", "重庆大学", "山东大学", "中国海洋大学", "厦门大学",
  "吉林大学", "大连理工大学", "东北大学", "兰州大学", "国防科技大学",
  "中南大学", "湖南大学", "同济大学", "华东师范大学", "北京师范大学",
  "中国农业大学", "西北农林科技大学", "中央民族大学", "郑州大学",
  "云南大学", "新疆大学", "海南大学", "宁夏大学", "青海大学",
  "西藏大学", "广西大学", "贵州大学", "南昌大学", "福州大学",
  "合肥工业大学", "安徽大学", "南京航空航天大学", "南京理工大学",
  "苏州大学", "上海大学", "华东理工大学", "东华大学", "上海财经大学",
  "中央财经大学", "对外经济贸易大学", "西南财经大学", "中南财经政法大学",
  "北京外国语大学", "上海外国语大学", "中国政法大学", "外交学院",
  "北京邮电大学", "西安电子科技大学", "南京邮电大学",
  "华北电力大学", "中国矿业大学", "中国地质大学", "中国石油大学",
  "河海大学", "江南大学", "北京交通大学", "北京科技大学",
  "北京化工大学", "北京工业大学", "北京林业大学", "中国传媒大学",
  "中央音乐学院", "中央美术学院", "北京电影学院", "中央戏剧学院",
  "华南师范大学", "华中师范大学", "东北师范大学", "南京师范大学",
  "陕西师范大学", "湖南师范大学", "首都师范大学",
  "西南大学", "暨南大学", "深圳大学", "宁波大学",
  "河南大学", "山西大学", "河北大学", "湖北大学",
  "青岛大学", "广州大学", "成都大学", "长江大学",
  "三峡大学", "南华大学", "南航", "南理工",
  "中国科学院大学", "中国社会科学院大学",
  "军事科学院", "中国工程物理研究院",
  "上海科技大学", "南方科技大学",
  "西湖大学", "武汉理工大学",
  "太原理工大学", "华南农业大学", "湘潭大学",
  "南京林业大学", "北京中医药大学", "上海中医药大学",
  "广州中医药大学", "南京中医药大学", "成都中医药大学",
  "东北林业大学", "东北农业大学", "四川农业大学",
  "安徽农业大学", "福建农林大学",
  "上海师范大学", "浙江师范大学", "杭州师范大学",
  "安徽师范大学", "福建师范大学", "山东师范大学",
  "天津师范大学", "四川师范大学", "重庆师范大学",
  "西北大学", "西南石油大学", "西安理工大学",
  "西安建筑科技大学", "西安科技大学", "西安工业大学",
  "西安外国语大学", "西安美术学院", "西安音乐学院",
  "湖北工业大学", "武汉科技大学", "武汉工程大学",
  "安徽工业大学", "安徽理工大学", "安徽财经大学",
  "浙江工业大学", "浙江理工大学", "浙江工商大学",
  "杭州电子科技大学", "浙江财经大学",
  "重庆邮电大学", "重庆交通大学", "重庆工商大学",
  "华北理工大学", "河北工业大学", "燕山大学",
  "东北财经大学", "江西财经大学", "天津财经大学",
  "长沙理工大学", "湖南科技大学", "南华大学",
  "哈尔滨工程大学", "哈尔滨医科大学",
  "中国医科大学", "大连医科大学",
  "上海海洋大学", "上海海事大学",
  "中国民航大学", "中国计量大学",
  "广东工业大学", "广州医科大学",
  "昆明理工大学", "云南师范大学",
  "广西师范大学", "桂林电子科技大学",
];

// ===== 学科大类映射（用于跨专业检测） =====

const MAJOR_CATEGORIES: Record<string, string> = {
  // 理工类
  "计算机": "stem", "计算机科学": "stem", "计算机科学与技术": "stem",
  "软件工程": "stem", "人工智能": "stem", "数据科学": "stem",
  "大数据": "stem", "网络工程": "stem", "信息安全": "stem",
  "数学": "stem", "应用数学": "stem", "统计学": "stem",
  "物理": "stem", "应用物理": "stem", "核物理": "stem",
  "化学": "stem", "应用化学": "stem", "化工": "stem",
  "生物": "stem", "生物技术": "stem", "生物工程": "stem",
  "机械": "stem", "机械工程": "stem", "机械设计": "stem",
  "电子": "stem", "电子工程": "stem", "微电子": "stem",
  "通信": "stem", "通信工程": "stem", "信息工程": "stem",
  "自动化": "stem", "控制工程": "stem", "机器人": "stem",
  "土木": "stem", "土木工程": "stem", "建筑": "stem",
  "材料": "stem", "材料科学": "stem", "材料工程": "stem",
  "环境": "stem", "环境工程": "stem", "环境科学": "stem",
  "测绘": "stem", "遥感": "stem", "地理信息": "stem",
  "地质": "stem", "地质工程": "stem", "矿业": "stem",
  "水利": "stem", "水利工程": "stem", "海洋科学": "stem",
  "航空航天": "stem", "飞行器": "stem", "船舶": "stem",
  "核科学": "stem", "核工程": "stem", "能源": "stem",

  // 经管类
  "经济": "social", "经济学": "social", "金融": "social",
  "金融学": "social", "保险": "social", "财政": "social",
  "税务": "social", "国际贸易": "social", "国际经济": "social",
  "管理": "social", "管理学": "social", "工商管理": "social",
  "会计": "social", "财务管理": "social", "审计": "social",
  "市场营销": "social", "人力资源": "social",
  "公共管理": "social", "行政管理": "social", "社会保障": "social",

  // 法学类
  "法学": "law", "法律": "law", "知识产权": "law", "社会学": "law",
  "社会工作": "law", "政治学": "law", "国际政治": "law", "外交": "law",

  // 文学类
  "中文": "humanities", "中国语言文学": "humanities", "汉语": "humanities",
  "外语": "humanities", "英语": "humanities", "日语": "humanities",
  "法语": "humanities", "德语": "humanities", "翻译": "humanities",
  "新闻": "humanities", "新闻学": "humanities", "传播学": "humanities",
  "广告": "humanities", "出版": "humanities",
  "历史": "humanities", "历史学": "humanities", "考古": "humanities",
  "哲学": "humanities", "马克思主义": "humanities",

  // 教育类
  "教育": "education", "教育学": "education", "心理学": "education",
  "体育": "education", "体育学": "education", "学前教育": "education",

  // 医学类
  "临床医学": "medical", "基础医学": "medical", "口腔医学": "medical",
  "药学": "medical", "中药学": "medical", "护理": "medical",
  "公共卫生": "medical", "预防医学": "medical", "中医学": "medical",
  "中西医结合": "medical", "医学技术": "medical", "康复": "medical",

  // 艺术类
  "美术": "arts", "美术学": "arts", "设计": "arts", "艺术设计": "arts",
  "音乐": "arts", "舞蹈": "arts", "戏剧": "arts", "影视": "arts",
  "数字媒体": "arts", "动画": "arts", "摄影": "arts",
};

/** 学科大类中文名 */
const CATEGORY_LABELS: Record<string, string> = {
  stem: "理工类",
  social: "经管类",
  law: "法学类",
  humanities: "文史类",
  education: "教育类",
  medical: "医学类",
  arts: "艺术类",
};

/** 跨专业风险等级 */
const CROSS_MAJOR_RISK: Record<string, Record<string, string>> = {
  stem: { medical: "高", arts: "高", law: "中", humanities: "中" },
  social: { stem: "中", medical: "高", arts: "中" },
  law: { stem: "高", medical: "高", arts: "高" },
  humanities: { stem: "高", medical: "高" },
  education: { medical: "高", stem: "中" },
  medical: { stem: "高", arts: "高", law: "高" },
  arts: { stem: "中", medical: "高" },
};

// ===== 核心验证函数 =====

/**
 * 从学科名中提取大类
 */
function inferMajorCategory(major: string): string | null {
  for (const [keyword, category] of Object.entries(MAJOR_CATEGORIES)) {
    if (major.includes(keyword)) return category;
  }
  return null;
}

/**
 * 学校名称检查
 */
function checkSchool(school: string, input: ValidationInput): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!school || school.trim().length === 0) {
    warnings.push({
      field: "school",
      type: "error",
      title: "学校名称为空",
      message: "请填写目标院校名称",
      suggestion: "例如：北京大学、清华大学",
    });
    return warnings;
  }

  // 检查是否包含非法字符
  if (/[0-9]/.test(school) && /[a-zA-Z]/.test(school)) {
    warnings.push({
      field: "school",
      type: "error",
      title: "学校名称格式异常",
      message: `"${school}" 包含数字和字母，可能不是正确的学校名称`,
      suggestion: "请填写中文学校全称，例如「北京大学」而非「北大985」",
    });
    return warnings;
  }

  // 检查是否以大学/学院等结尾
  const hasSuffix = UNI_SUFFIXES.some((s) => school.includes(s));
  const isKnown = KNOWN_UNIVERSITIES.some((u) => school.includes(u));

  if (!hasSuffix && !isKnown) {
    warnings.push({
      field: "school",
      type: "risk",
      title: "学校名称格式异常",
      message: `"${school}" 看起来不像标准的大学名称`,
      suggestion: "建议填写完整名称，如「北京科技大学」而非「北京科技」",
    });
  }

  // 常见错误：学校名 + 985/211
  if (/985$/.test(school) || /211$/.test(school)) {
    warnings.push({
      field: "school",
      type: "error",
      title: "学校名称包含等级标记",
      message: `"${school}" 中包含了"985"或"211"标记`,
      suggestion: `请去掉等级标记，填写学校全称，如「${school.replace(/985|211$/, "")}大学」`,
    });
  }

  // 名校竞争提示
  const isTopSchool = KNOWN_UNIVERSITIES.some(
    (u) => school.includes(u) && ["北京", "清华", "复旦", "上海交通", "浙江", "南京", "中国科学"].some((p) => u.startsWith(p))
  );

  if (isTopSchool) {
    const level = input.education_background.includes("零基础") || input.education_background.includes("beginner")
      ? "较高风险"
      : "有一定竞争";

    warnings.push({
      field: "school",
      type: "risk",
      title: "目标院校竞争强度",
      message: `${school} 是国内顶尖院校，竞争激烈（${level}）`,
      suggestion: "可以同时准备一个备选院校，但现阶段全力以赴就好",
    });
  }

  return warnings;
}

/**
 * 专业跨考检测
 */
function checkMajor(major: string, input: ValidationInput): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!major || major.trim().length === 0) {
    warnings.push({
      field: "major",
      type: "error",
      title: "专业名称为空",
      message: "请填写目标专业名称",
      suggestion: "例如：计算机科学与技术、法学",
    });
    return warnings;
  }

  // 跨专业检测：通过考试科目推断本科背景
  const targetCategory = inferMajorCategory(major);
  if (!targetCategory) return warnings;

  // 从考试科目推断背景
  let backgroundCategory: string | null = null;
  if (input.subjects && input.subjects.length > 0) {
    for (const subject of input.subjects) {
      const cat = inferMajorCategory(subject);
      if (cat) {
        backgroundCategory = cat;
        break;
      }
    }
  }

  // 如果无法从科目推断，exam_subjects的第一个学科关键词可能指示方向

  if (backgroundCategory && backgroundCategory !== targetCategory) {
    const risk = CROSS_MAJOR_RISK[backgroundCategory]?.[targetCategory] || "中";

    warnings.push({
      field: "major",
      type: risk === "高" ? "error" : "risk",
      title: "检测到跨专业报考",
      message: `从 ${CATEGORY_LABELS[backgroundCategory] || backgroundCategory} 跨考到 ${CATEGORY_LABELS[targetCategory] || targetCategory}，跨度${risk === "高" ? "较大" : "中等"}`,
      suggestion: risk === "高"
        ? "跨专业难度较大，建议提前了解目标专业的专业课难度，必要时考虑相近专业"
        : "跨专业需要更多时间准备专业课，建议在计划中为专业课预留更多时间",
    });
  }

  return warnings;
}

/**
 * 时间合理性检查
 */
function checkTimeRatio(input: ValidationInput): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const now = new Date();
  const examDate = new Date(input.exam_year, 11, 21); // 考研一般在12月21日左右
  const remainingDays = Math.ceil(
    (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (remainingDays <= 0) {
    warnings.push({
      field: "exam_year",
      type: "error",
      title: "考试年份已过",
      message: `目标考试年份 ${input.exam_year} 的考研已经结束`,
      suggestion: "请确认考试年份是否正确",
    });
    return warnings;
  }

  // 时间紧 + 目标高
  const isTopSchool = KNOWN_UNIVERSITIES.some(
    (u) => input.target_school.includes(u) && (u.startsWith("北京") && u !== "北京工业大学" && u !== "北京化工" && u !== "北京科技" && u !== "北京林业" && u !== "北京中医药" && u !== "北京外国语" && u !== "北京邮电" || u.startsWith("清华") || u.startsWith("复旦") || u.startsWith("浙江") || u.startsWith("南京") || u.startsWith("上海交通") || u.startsWith("中国科学"))
  );

  if (remainingDays < 90 && isTopSchool) {
    warnings.push({
      field: "daily_hours",
      type: "error",
      title: "时间与目标不匹配",
      message: `距离考研仅剩 ${remainingDays} 天，目标为竞争激烈的院校，当前每天 ${input.daily_hours} 小时可能不足以完成准备`,
      suggestion: remainingDays < 60
        ? "建议结合实际情况评估目标是否合理，可以考虑备战下一年的考试"
        : "建议延长每日学习时间，或考虑目标调整",
    });
  }

  // 低学习时间风险
  if (input.daily_hours < 3 && remainingDays > 30) {
    warnings.push({
      field: "daily_hours",
      type: "risk",
      title: "学习时间偏少",
      message: `每天 ${input.daily_hours} 小时的学习时间，对于考研准备来说偏少`,
      suggestion: "建议确保每天至少4-6小时的高效学习时间，周末可以适当增加",
    });
  }

  // 不合理的高学习时间
  if (input.daily_hours > 14) {
    warnings.push({
      field: "daily_hours",
      type: "risk",
      title: "学习时间可能过于理想化",
      message: `每天 ${input.daily_hours} 小时学习在现实中很难长期坚持`,
      suggestion: "建议设定8-10小时为上限，留出休息和复盘时间，持续更重要",
    });
  }

  return warnings;
}

/**
 * 基础与目标匹配检查
 */
function checkLevelMatch(input: ValidationInput): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const level = input.education_background || "";
  const isBeginner = level.includes("零基础") || level.includes("beginner");
  const isAdvanced = level.includes("基础较好") || level.includes("advanced") || level.includes("good_basis");

  // 零基础 + 短时间 + 名校
  if (isBeginner) {
    const now = new Date();
    const examDate = new Date(input.exam_year, 11, 21);
    const remainingDays = Math.ceil(
      (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isTopSchool = KNOWN_UNIVERSITIES.some(
      (u) => input.target_school.includes(u) && (u.startsWith("北京") || u.startsWith("清华") || u.startsWith("复旦") || u.startsWith("上海交通") || u.startsWith("浙江") || u.startsWith("南京") || u.startsWith("中国科学"))
    );

    if (isTopSchool && remainingDays < 365) {
      warnings.push({
        field: "level",
        type: "risk",
        title: "零基础冲刺名校",
        message: `${isTopSchool ? "目标院校竞争激烈，" : ""}当前基础较弱，距离考研约 ${remainingDays} 天`,
        suggestion: "建议尽快开始基础阶段学习，优先攻克薄弱科目，可以考虑报辅导班或找学长学姐指导",
      });
    }

    // 薄弱学科预警
    if (input.weak_subjects.length > 2) {
      warnings.push({
        field: "weak_subjects",
        type: "risk",
        title: "薄弱科目较多",
        message: `有 ${input.weak_subjects.length} 个薄弱科目需要重点加强`,
        suggestion: "建议先在薄弱科目上投入更多时间，不要平均用力",
      });
    }
  }

  // 数学弱 + 理工科目标
  const hasMathWeak = input.weak_subjects.some(
    (s) => s.includes("数学") || s.includes("高数")
  );
  const targetIsStem = inferMajorCategory(input.target_major) === "stem";

  if (hasMathWeak && targetIsStem) {
    warnings.push({
      field: "weak_subjects",
      type: "risk",
      title: "数学薄弱但报考理工类",
      message: "目标专业属于理工类，数学是核心科目，当前数学基础较弱",
      suggestion: "建议在备考前期（前3个月）将50%以上时间投入数学基础复习",
    });
  }

  return warnings;
}

/**
 * 教育背景描述规范化
 */
function describeEducationBackground(level: string): string {
  const map: Record<string, string> = {
    beginner: "零基础",
    some_basis: "有一定基础",
    good_basis: "基础较好",
    advanced: "基础扎实",
  };
  return map[level] || level;
}

/**
 * 主验证函数
 *
 * 对用户填写的考研信息进行全面合理性检测。
 * 返回验证结果，包含所有警告和建议。
 */
export function validateProfile(input: ValidationInput): ValidationResult {
  const allWarnings: ValidationWarning[] = [];

  // 1. 学校名称检查
  allWarnings.push(...checkSchool(input.target_school, input));

  // 2. 专业跨考检测
  allWarnings.push(...checkMajor(input.target_major, input));

  // 3. 时间合理性
  allWarnings.push(...checkTimeRatio(input));

  // 4. 基础与目标匹配
  allWarnings.push(...checkLevelMatch(input));

  // 计算可信度
  let confidence = 100;
  const errors = allWarnings.filter((w) => w.type === "error").length;
  const risks = allWarnings.filter((w) => w.type === "risk").length;

  confidence -= errors * 20;
  confidence -= risks * 10;

  return {
    valid: allWarnings.filter((w) => w.type === "error").length === 0,
    confidence: Math.max(0, Math.min(100, confidence)),
    warnings: allWarnings,
  };
}
