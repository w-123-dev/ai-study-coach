/**
 * 院校专业种子数据
 *
 * 包含中国主要考研院校的公开信息。
 * 数据来源：各校研究生院官网、研招网公开信息。
 * 实际使用时请根据最新数据更新。
 */
export const SEED_SCHOOL_PROFILES = [
  // ===== 北京大学（985） =====
  { school: "北京大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 375, school_tier: "985", major_ranking: "A+" },
  { school: "北京大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 390, school_tier: "985", major_ranking: "A+" },
  { school: "北京大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },
  { school: "北京大学", major: "法律（非法学）", exam_subjects: ["政治", "英语一", "398法硕联考专业基础", "498法硕联考综合"], cutoff_score: 380, school_tier: "985", major_ranking: "A+" },
  { school: "北京大学", major: "中国语言文学", exam_subjects: ["政治", "英语一", "中国语言文学综合"], cutoff_score: 365, school_tier: "985", major_ranking: "A+" },
  { school: "北京大学", major: "新闻与传播", exam_subjects: ["政治", "英语二", "334新闻与传播综合", "440新闻与传播基础"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },

  // ===== 清华大学（985） =====
  { school: "清华大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "912计算机专业基础综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },
  { school: "清华大学", major: "金融", exam_subjects: ["政治", "英语二", "数学三", "431金融学综合"], cutoff_score: 395, school_tier: "985", major_ranking: "A+" },
  { school: "清华大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 365, school_tier: "985", major_ranking: "A" },
  { school: "清华大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "905机械设计基础"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "清华大学", major: "电子科学与技术", exam_subjects: ["政治", "英语一", "数学一", "电子技术基础"], cutoff_score: 365, school_tier: "985", major_ranking: "A+" },
  { school: "清华大学", major: "马克思主义理论", exam_subjects: ["政治", "英语一", "马克思主义基本原理"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },

  // ===== 复旦大学（985） =====
  { school: "复旦大学", major: "金融", exam_subjects: ["政治", "英语二", "数学三", "431金融学综合"], cutoff_score: 385, school_tier: "985", major_ranking: "A+" },
  { school: "复旦大学", major: "新闻与传播", exam_subjects: ["政治", "英语二", "334新闻与传播综合", "440新闻与传播基础"], cutoff_score: 375, school_tier: "985", major_ranking: "A" },
  { school: "复旦大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 360, school_tier: "985", major_ranking: "B+" },
  { school: "复旦大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 360, school_tier: "985", major_ranking: "A" },
  { school: "复旦大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },

  // ===== 上海交通大学（985） =====
  { school: "上海交通大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 365, school_tier: "985", major_ranking: "A" },
  { school: "上海交通大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "上海交通大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 380, school_tier: "985", major_ranking: "A" },
  { school: "上海交通大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 355, school_tier: "985", major_ranking: "A+" },
  { school: "上海交通大学", major: "电子科学与技术", exam_subjects: ["政治", "英语一", "数学一", "电子工程基础"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },

  // ===== 浙江大学（985） =====
  { school: "浙江大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },
  { school: "浙江大学", major: "控制科学与工程", exam_subjects: ["政治", "英语一", "数学一", "控制理论"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "浙江大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 380, school_tier: "985", major_ranking: "A" },
  { school: "浙江大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "浙江大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },

  // ===== 南京大学（985） =====
  { school: "南京大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 365, school_tier: "985", major_ranking: "A" },
  { school: "南京大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 375, school_tier: "985", major_ranking: "A" },
  { school: "南京大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "南京大学", major: "中国语言文学", exam_subjects: ["政治", "英语一", "文学综合"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "南京大学", major: "物理学", exam_subjects: ["政治", "英语一", "普通物理"], cutoff_score: 340, school_tier: "985", major_ranking: "A+" },

  // ===== 中国人民大学（985） =====
  { school: "中国人民大学", major: "金融", exam_subjects: ["政治", "英语二", "396经济类综合能力", "431金融学综合"], cutoff_score: 390, school_tier: "985", major_ranking: "A+" },
  { school: "中国人民大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 365, school_tier: "985", major_ranking: "A+" },
  { school: "中国人民大学", major: "新闻与传播", exam_subjects: ["政治", "英语二", "334新闻与传播综合", "440新闻与传播基础"], cutoff_score: 370, school_tier: "985", major_ranking: "A+" },
  { school: "中国人民大学", major: "工商管理", exam_subjects: ["管理类综合能力", "英语二"], cutoff_score: 180, school_tier: "985", major_ranking: "A+" },

  // ===== 北京航空航天大学（985） =====
  { school: "北京航空航天大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "961计算机基础综合"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "北京航空航天大学", major: "航空宇航科学与技术", exam_subjects: ["政治", "英语一", "数学一", "力学基础"], cutoff_score: 340, school_tier: "985", major_ranking: "A+" },
  { school: "北京航空航天大学", major: "控制科学与工程", exam_subjects: ["政治", "英语一", "数学一", "控制理论"], cutoff_score: 345, school_tier: "985", major_ranking: "A+" },
  { school: "北京航空航天大学", major: "软件工程", exam_subjects: ["政治", "英语一", "数学一", "软件工程基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },

  // ===== 北京理工大学（985） =====
  { school: "北京理工大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 345, school_tier: "985", major_ranking: "B+" },
  { school: "北京理工大学", major: "车辆工程", exam_subjects: ["政治", "英语一", "数学一", "车辆工程基础"], cutoff_score: 340, school_tier: "985", major_ranking: "A" },
  { school: "北京理工大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械基础"], cutoff_score: 335, school_tier: "985", major_ranking: "A" },

  // ===== 哈尔滨工业大学（985） =====
  { school: "哈尔滨工业大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "854计算机基础"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },
  { school: "哈尔滨工业大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计"], cutoff_score: 335, school_tier: "985", major_ranking: "A+" },
  { school: "哈尔滨工业大学", major: "控制科学与工程", exam_subjects: ["政治", "英语一", "数学一", "控制理论"], cutoff_score: 340, school_tier: "985", major_ranking: "A+" },
  { school: "哈尔滨工业大学", major: "土木工程", exam_subjects: ["政治", "英语一", "数学一", "结构力学"], cutoff_score: 335, school_tier: "985", major_ranking: "A" },

  // ===== 西安交通大学（985） =====
  { school: "西安交通大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },
  { school: "西安交通大学", major: "电气工程", exam_subjects: ["政治", "英语一", "数学一", "电路"], cutoff_score: 355, school_tier: "985", major_ranking: "A+" },
  { school: "西安交通大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计基础"], cutoff_score: 340, school_tier: "985", major_ranking: "A" },
  { school: "西安交通大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A" },

  // ===== 武汉大学（985） =====
  { school: "武汉大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },
  { school: "武汉大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "武汉大学", major: "新闻与传播", exam_subjects: ["政治", "英语二", "334新闻与传播综合", "440新闻与传播基础"], cutoff_score: 360, school_tier: "985", major_ranking: "A" },
  { school: "武汉大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A" },
  { school: "武汉大学", major: "测绘科学与技术", exam_subjects: ["政治", "英语一", "数学一", "测绘基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A+" },

  // ===== 华中科技大学（985） =====
  { school: "华中科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "华中科技大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计"], cutoff_score: 345, school_tier: "985", major_ranking: "A+" },
  { school: "华中科技大学", major: "光电信息工程", exam_subjects: ["政治", "英语一", "数学一", "光学"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },
  { school: "华中科技大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },

  // ===== 中山大学（985） =====
  { school: "中山大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 345, school_tier: "985", major_ranking: "B+" },
  { school: "中山大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A" },
  { school: "中山大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 340, school_tier: "985", major_ranking: "A" },
  { school: "中山大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 350, school_tier: "985", major_ranking: "B+" },

  // ===== 四川大学（985） =====
  { school: "四川大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "985", major_ranking: "B+" },
  { school: "四川大学", major: "口腔医学", exam_subjects: ["政治", "英语一", "352口腔综合"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "四川大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },
  { school: "四川大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 345, school_tier: "985", major_ranking: "B+" },

  // ===== 南开大学（985） =====
  { school: "南开大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 375, school_tier: "985", major_ranking: "A" },
  { school: "南开大学", major: "经济学", exam_subjects: ["政治", "英语一", "数学三", "经济学基础"], cutoff_score: 370, school_tier: "985", major_ranking: "A" },
  { school: "南开大学", major: "化学", exam_subjects: ["政治", "英语一", "化学综合"], cutoff_score: 340, school_tier: "985", major_ranking: "A+" },
  { school: "南开大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 345, school_tier: "985", major_ranking: "B" },

  // ===== 天津大学（985） =====
  { school: "天津大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "901数据结构与程序设计"], cutoff_score: 340, school_tier: "985", major_ranking: "B+" },
  { school: "天津大学", major: "化学工程", exam_subjects: ["政治", "英语一", "数学一", "化工原理"], cutoff_score: 330, school_tier: "985", major_ranking: "A+" },
  { school: "天津大学", major: "建筑学", exam_subjects: ["政治", "英语一", "建筑学基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },
  { school: "天津大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },

  // ===== 中国科学技术大学（985） =====
  { school: "中国科学技术大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 355, school_tier: "985", major_ranking: "A" },
  { school: "中国科学技术大学", major: "物理学", exam_subjects: ["政治", "英语一", "普通物理"], cutoff_score: 345, school_tier: "985", major_ranking: "A+" },
  { school: "中国科学技术大学", major: "数学", exam_subjects: ["政治", "英语一", "数学分析", "高等代数"], cutoff_score: 340, school_tier: "985", major_ranking: "A+" },
  { school: "中国科学技术大学", major: "化学", exam_subjects: ["政治", "英语一", "化学综合"], cutoff_score: 335, school_tier: "985", major_ranking: "A+" },

  // ===== 国防科技大学（985） =====
  { school: "国防科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },
  { school: "国防科技大学", major: "软件工程", exam_subjects: ["政治", "英语一", "数学一", "软件工程基础"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },

  // ===== 同济大学（985） =====
  { school: "同济大学", major: "建筑学", exam_subjects: ["政治", "英语一", "建筑学基础"], cutoff_score: 355, school_tier: "985", major_ranking: "A+" },
  { school: "同济大学", major: "土木工程", exam_subjects: ["政治", "英语一", "数学一", "结构力学"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },
  { school: "同济大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 350, school_tier: "985", major_ranking: "B+" },
  { school: "同济大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计"], cutoff_score: 335, school_tier: "985", major_ranking: "A" },

  // ===== 厦门大学（985） =====
  { school: "厦门大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 370, school_tier: "985", major_ranking: "A" },
  { school: "厦门大学", major: "会计", exam_subjects: ["管理类综合能力", "英语二"], cutoff_score: 195, school_tier: "985", major_ranking: "A" },
  { school: "厦门大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },
  { school: "厦门大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "985", major_ranking: "B+" },

  // ===== 中南大学（985） =====
  { school: "中南大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "985", major_ranking: "B+" },
  { school: "中南大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 340, school_tier: "985", major_ranking: "A" },
  { school: "中南大学", major: "材料科学与工程", exam_subjects: ["政治", "英语一", "数学一", "材料科学基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },

  // ===== 大连理工大学（985） =====
  { school: "大连理工大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 335, school_tier: "985", major_ranking: "B+" },
  { school: "大连理工大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械制造基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },
  { school: "大连理工大学", major: "化工", exam_subjects: ["政治", "英语一", "数学一", "化工原理"], cutoff_score: 325, school_tier: "985", major_ranking: "A" },

  // ===== 华东师范大学（985） =====
  { school: "华东师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 355, school_tier: "985", major_ranking: "A+" },
  { school: "华东师范大学", major: "心理学", exam_subjects: ["政治", "英语一", "312心理学专业基础"], cutoff_score: 360, school_tier: "985", major_ranking: "A" },
  { school: "华东师范大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "985", major_ranking: "B" },

  // ===== 北京师范大学（985） =====
  { school: "北京师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 360, school_tier: "985", major_ranking: "A+" },
  { school: "北京师范大学", major: "心理学", exam_subjects: ["政治", "英语一", "347心理学专业综合"], cutoff_score: 365, school_tier: "985", major_ranking: "A+" },
  { school: "北京师范大学", major: "中国语言文学", exam_subjects: ["政治", "英语一", "文学综合"], cutoff_score: 355, school_tier: "985", major_ranking: "A+" },
  { school: "北京师范大学", major: "数学", exam_subjects: ["政治", "英语一", "数学分析", "高等代数"], cutoff_score: 340, school_tier: "985", major_ranking: "A" },

  // ===== 电子科技大学（985） =====
  { school: "电子科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "820计算机专业基础"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },
  { school: "电子科技大学", major: "信息与通信工程", exam_subjects: ["政治", "英语一", "数学一", "通信原理"], cutoff_score: 350, school_tier: "985", major_ranking: "A+" },
  { school: "电子科技大学", major: "电子科学与技术", exam_subjects: ["政治", "英语一", "数学一", "电子技术基础"], cutoff_score: 345, school_tier: "985", major_ranking: "A+" },

  // ===== 重庆大学（985） =====
  { school: "重庆大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 335, school_tier: "985", major_ranking: "B+" },
  { school: "重庆大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械设计基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },
  { school: "重庆大学", major: "土木工程", exam_subjects: ["政治", "英语一", "数学一", "结构力学"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },

  // ===== 山东大学（985） =====
  { school: "山东大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 335, school_tier: "985", major_ranking: "B" },
  { school: "山东大学", major: "数学", exam_subjects: ["政治", "英语一", "数学分析", "高等代数"], cutoff_score: 345, school_tier: "985", major_ranking: "A+" },
  { school: "山东大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 335, school_tier: "985", major_ranking: "A" },
  { school: "山东大学", major: "中国语言文学", exam_subjects: ["政治", "英语一", "文学综合"], cutoff_score: 350, school_tier: "985", major_ranking: "A" },

  // ===== 吉林大学（985） =====
  { school: "吉林大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 330, school_tier: "985", major_ranking: "B+" },
  { school: "吉林大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },
  { school: "吉林大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },

  // ===== 华南理工大学（985） =====
  { school: "华南理工大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "985", major_ranking: "B+" },
  { school: "华南理工大学", major: "机械工程", exam_subjects: ["政治", "英语一", "数学一", "机械基础"], cutoff_score: 330, school_tier: "985", major_ranking: "A" },
  { school: "华南理工大学", major: "建筑设计", exam_subjects: ["政治", "英语一", "建筑设计基础"], cutoff_score: 345, school_tier: "985", major_ranking: "A" },

  // ===== 中国科学院大学（双一流） =====
  { school: "中国科学院大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 355, school_tier: "双一流", major_ranking: "A+" },
  { school: "中国科学院大学", major: "物理学", exam_subjects: ["政治", "英语一", "普通物理"], cutoff_score: 340, school_tier: "双一流", major_ranking: "A+" },
  { school: "中国科学院大学", major: "数学", exam_subjects: ["政治", "英语一", "数学分析", "高等代数"], cutoff_score: 335, school_tier: "双一流", major_ranking: "A+" },
  { school: "中国科学院大学", major: "化学", exam_subjects: ["政治", "英语一", "化学综合"], cutoff_score: 330, school_tier: "双一流", major_ranking: "A+" },

  // ===== 211 院校 =====
  { school: "北京邮电大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "211", major_ranking: "A" },
  { school: "北京邮电大学", major: "信息与通信工程", exam_subjects: ["政治", "英语一", "数学一", "通信原理"], cutoff_score: 345, school_tier: "211", major_ranking: "A+" },
  { school: "北京邮电大学", major: "电子科学与技术", exam_subjects: ["政治", "英语一", "数学一", "电子技术基础"], cutoff_score: 335, school_tier: "211", major_ranking: "A" },

  { school: "西安电子科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 340, school_tier: "211", major_ranking: "A" },
  { school: "西安电子科技大学", major: "信息与通信工程", exam_subjects: ["政治", "英语一", "数学一", "通信原理"], cutoff_score: 340, school_tier: "211", major_ranking: "A+" },

  { school: "北京科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "871计算机综合"], cutoff_score: 330, school_tier: "211", major_ranking: "B+" },
  { school: "北京科技大学", major: "材料科学与工程", exam_subjects: ["政治", "英语一", "数学一", "材料科学基础"], cutoff_score: 320, school_tier: "211", major_ranking: "A" },

  { school: "北京交通大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 335, school_tier: "211", major_ranking: "B+" },
  { school: "北京交通大学", major: "交通运输工程", exam_subjects: ["政治", "英语一", "数学一", "交通运输基础"], cutoff_score: 325, school_tier: "211", major_ranking: "A+" },

  { school: "南京航空航天大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "829计算机专业基础"], cutoff_score: 330, school_tier: "211", major_ranking: "B+" },
  { school: "南京航空航天大学", major: "航空宇航科学与技术", exam_subjects: ["政治", "英语一", "数学一", "力学基础"], cutoff_score: 325, school_tier: "211", major_ranking: "A+" },

  { school: "南京理工大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 330, school_tier: "211", major_ranking: "B+" },
  { school: "南京理工大学", major: "兵器科学与技术", exam_subjects: ["政治", "英语一", "数学一", "兵器工程基础"], cutoff_score: 315, school_tier: "211", major_ranking: "A+" },

  { school: "华东理工大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 325, school_tier: "211", major_ranking: "C+" },
  { school: "华东理工大学", major: "化学工程", exam_subjects: ["政治", "英语一", "数学一", "化工原理"], cutoff_score: 320, school_tier: "211", major_ranking: "A+" },

  { school: "苏州大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 330, school_tier: "211", major_ranking: "B" },
  { school: "苏州大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 345, school_tier: "211", major_ranking: "B+" },

  { school: "郑州大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 310, school_tier: "211", major_ranking: "C+" },
  { school: "郑州大学", major: "临床医学", exam_subjects: ["政治", "英语一", "306临床医学综合能力"], cutoff_score: 315, school_tier: "211", major_ranking: "B" },

  { school: "上海财经大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 380, school_tier: "211", major_ranking: "A" },
  { school: "上海财经大学", major: "会计", exam_subjects: ["管理类综合能力", "英语二"], cutoff_score: 200, school_tier: "211", major_ranking: "A" },

  { school: "中央财经大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 380, school_tier: "211", major_ranking: "A+" },
  { school: "中央财经大学", major: "会计", exam_subjects: ["管理类综合能力", "英语二"], cutoff_score: 195, school_tier: "211", major_ranking: "A" },

  { school: "对外经济贸易大学", major: "金融", exam_subjects: ["政治", "英语一", "396经济类综合能力", "431金融学综合"], cutoff_score: 370, school_tier: "211", major_ranking: "A" },
  { school: "对外经济贸易大学", major: "国际贸易", exam_subjects: ["政治", "英语一", "396经济类综合能力", "国际贸易基础"], cutoff_score: 365, school_tier: "211", major_ranking: "A" },

  { school: "西南财经大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 365, school_tier: "211", major_ranking: "A" },
  { school: "西南财经大学", major: "会计", exam_subjects: ["管理类综合能力", "英语二"], cutoff_score: 190, school_tier: "211", major_ranking: "A" },

  { school: "中南财经政法大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 360, school_tier: "211", major_ranking: "A" },
  { school: "中南财经政法大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 340, school_tier: "211", major_ranking: "A" },

  { school: "北京外国语大学", major: "英语语言文学", exam_subjects: ["政治", "二外", "英语基础", "英语综合"], cutoff_score: 360, school_tier: "211", major_ranking: "A+" },
  { school: "上海外国语大学", major: "英语语言文学", exam_subjects: ["政治", "二外", "英语基础", "英语综合"], cutoff_score: 355, school_tier: "211", major_ranking: "A" },

  { school: "中国政法大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 360, school_tier: "211", major_ranking: "A+" },
  { school: "中国政法大学", major: "法律（非法学）", exam_subjects: ["政治", "英语一", "398法硕联考专业基础", "498法硕联考综合"], cutoff_score: 370, school_tier: "211", major_ranking: "A+" },

  { school: "南京师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 350, school_tier: "211", major_ranking: "A" },
  { school: "南京师范大学", major: "心理学", exam_subjects: ["政治", "英语一", "312心理学专业基础"], cutoff_score: 355, school_tier: "211", major_ranking: "A" },

  { school: "华中师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 345, school_tier: "211", major_ranking: "A" },
  { school: "华中师范大学", major: "心理学", exam_subjects: ["政治", "英语一", "312心理学专业基础"], cutoff_score: 350, school_tier: "211", major_ranking: "B+" },

  { school: "东北师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 340, school_tier: "211", major_ranking: "A" },

  { school: "华南师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 345, school_tier: "211", major_ranking: "A" },

  { school: "陕西师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 340, school_tier: "211", major_ranking: "B+" },

  { school: "湖南师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 340, school_tier: "211", major_ranking: "B+" },

  { school: "西北大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 310, school_tier: "211", major_ranking: "B" },
  { school: "西北大学", major: "考古学", exam_subjects: ["政治", "英语一", "考古学综合"], cutoff_score: 345, school_tier: "211", major_ranking: "A+" },

  { school: "深圳大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 325, school_tier: "普通", major_ranking: "B" },
  { school: "深圳大学", major: "金融", exam_subjects: ["政治", "英语一", "数学三", "431金融学综合"], cutoff_score: 355, school_tier: "普通", major_ranking: "B+" },

  { school: "南方科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 330, school_tier: "双一流", major_ranking: "B" },

  { school: "上海科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 325, school_tier: "双一流", major_ranking: "B" },

  // ===== 双非但实力较强 =====
  { school: "杭州电子科技大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 310, school_tier: "普通", major_ranking: "B+" },
  { school: "重庆邮电大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "802数据结构"], cutoff_score: 310, school_tier: "普通", major_ranking: "B+" },
  { school: "南京邮电大学", major: "计算机科学与技术", exam_subjects: ["政治", "英语一", "数学一", "408计算机学科专业基础"], cutoff_score: 325, school_tier: "双一流", major_ranking: "B+" },

  { school: "首都师范大学", major: "教育学", exam_subjects: ["政治", "英语一", "311教育学专业基础"], cutoff_score: 340, school_tier: "双一流", major_ranking: "B+" },
  { school: "首都师范大学", major: "心理学", exam_subjects: ["政治", "英语一", "312心理学专业基础"], cutoff_score: 345, school_tier: "双一流", major_ranking: "B" },

  { school: "华东政法大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 345, school_tier: "普通", major_ranking: "A" },
  { school: "华东政法大学", major: "法律（非法学）", exam_subjects: ["政治", "英语一", "398法硕联考专业基础", "498法硕联考综合"], cutoff_score: 350, school_tier: "普通", major_ranking: "A" },

  { school: "西南政法大学", major: "法学", exam_subjects: ["政治", "英语一", "法学综合"], cutoff_score: 340, school_tier: "普通", major_ranking: "A" },
  { school: "西南政法大学", major: "法律（非法学）", exam_subjects: ["政治", "英语一", "398法硕联考专业基础", "498法硕联考综合"], cutoff_score: 345, school_tier: "普通", major_ranking: "A" },

  { school: "北京语言大学", major: "中国语言文学", exam_subjects: ["政治", "英语一", "文学综合"], cutoff_score: 355, school_tier: "普通", major_ranking: "A" },
];

/**
 * 种子数据插入 SQL 生成
 */
export function generateSeedSQL(): string {
  const rows = SEED_SCHOOL_PROFILES.map((p) => {
    const subjects = p.exam_subjects.map((s) => `'${s.replace(/'/g, "''")}'`).join(", ");
    return `('${p.school}', '${p.major}', ARRAY[${subjects}]::text[], ${p.cutoff_score || "NULL"}, '${p.school_tier}', '${p.major_ranking || ""}')`;
  });

  return `
-- 院校专业种子数据
INSERT INTO school_profiles (school, major, exam_subjects, cutoff_score, school_tier, major_ranking)
VALUES
${rows.join(",\n")}
ON CONFLICT DO NOTHING;
`;
}
