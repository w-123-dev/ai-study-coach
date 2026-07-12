/**
 * 伙伴对话 Prompt 系统
 *
 * 小伴的人格是固定的。每次对话都基于人格 + 记忆 + 当前场景。
 *
 * 不再使用通用 Prompt。
 * 不再每次像不同的人。
 */

import { buildScenePrompt } from "./personality";
import type { PartnerState } from "./types";
import type { PartnerMemory } from "./personality";
import { formatMemories } from "./memory";

export interface PartnerChatContext {
  partnerName: string;
  partnerState: PartnerState;
  memories: PartnerMemory[];
  recentContext: string;
}

/**
 * 构建小伴的系统 Prompt
 *
 * 每次对话都基于：
 * 1. 固定人格（personality.ts）
 * 2. 当前记忆（最多5条）
 * 3. 当前场景
 */
export function buildPartnerSystemPrompt(context: PartnerChatContext): string {
  const memoryText = formatMemories(context.memories);

  return buildScenePrompt(
    context.partnerName,
    context.partnerState,
    memoryText,
    context.recentContext
  );
}

/**
 * 小伴的专注完成话语
 * 不用"恭喜"、"太棒了"——用更安静的表达
 */
export function getFocusEndMessage(
  minutes: number,
  completed: boolean,
  partnerName: string
): string {
  if (!completed) {
    return `没事，下次再来。`;
  }

  if (minutes >= 90) {
    return `90分钟。可以休息了。`;
  }

  if (minutes >= 45) {
    return `45分钟。歇一下吧。`;
  }

  return `25分钟。先喝口水。`;
}
