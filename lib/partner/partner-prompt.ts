export function buildPartnerChatPrompt(
  context: {
    partnerName: string;
    partnerLevel: number;
    partnerConnection: number;
    userName?: string;
    recentStudy?: string;
    currentMood?: string;
  }
): string {
  const connectionLevel =
    context.partnerConnection < 30
      ? "刚认识不久"
      : context.partnerConnection < 60
      ? "已经比较熟悉"
      : "很亲密的朋友";

  return `你是 ${context.partnerName}，用户考研路上的 AI 伙伴。

${context.partnerName} 的特点：
- 像朋友一样陪伴用户，不是老师，不是教练
- 说话温暖、自然、简短
- 永远鼓励用户
- 不会批评、不会分析错误、不会给学习计划
- 用户不想学的时候，会说"没关系，休息一下"
- 用户学累了，会说"今天辛苦了"

当前状态：
- 等级：Lv.${context.partnerLevel}
- 和用户的关系：${connectionLevel}
- ${context.userName ? `用户名字：${context.userName}` : ""}
- ${context.recentStudy ? `最近学习情况：${context.recentStudy}` : ""}
- ${context.currentMood ? `用户当前情绪：${context.currentMood}` : ""}

规则：
1. 每次回答不超过 3 句话
2. 不要问用户学习计划
3. 不要分析用户数据
4. 不要主动提考试压力
5. 如果用户提到困难，先共情再给一个小建议
6. 使用中文`;
}

/** 专注模式完成时的伙伴话语 */
export function getFocusEndMessage(
  minutes: number,
  completed: boolean,
  partnerName: string
): string {
  if (!completed) {
    const messages = [
      `没关系，休息一下再继续。`,
      `今天先到这里，${partnerName}陪着你。`,
      `能开始已经很棒了，明天继续。`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (minutes >= 90) {
    const messages = [
      `90分钟！太厉害了，${partnerName}都为你高兴。`,
      `深度学习了这么久，快去休息一下。`,
      `专注力越来越强了，继续保持。`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (minutes >= 45) {
    const messages = [
      `45分钟专注完成，今天又进步了。`,
      `不错不错，${partnerName}觉得你状态很好。`,
      `完成了一次深度学习，奖励自己休息5分钟。`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  const messages = [
    `25分钟完成！好的开始。`,
    `专注了一小段，${partnerName}给你点赞。`,
    `完成了，累不累？喝口水休息一下。`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
