/**
 * 伙伴行为状态机
 *
 * 小伴不是一直站着不动，而是有随机微动作的。
 * 行为是纯视觉层，不影响数据库、API、对话系统。
 *
 * 行为列表：
 * - idle:       轻微浮动（默认）
 * - reading:    出现书本，眼睛下移
 * - thinking:   出现「...」思考点，眼睛上斜
 * - lookingAround: 眼睛左右滑动
 * - stretching: 伸懒腰，星形上拉
 * - sleeping:   闭眼 + Zzz（仅 resting 状态可用）
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { PartnerState } from "./types";

// ===== 行为类型 =====

export type PartnerBehavior =
  | "idle"
  | "reading"
  | "thinking"
  | "lookingAround"
  | "stretching"
  | "sleeping";

export const BEHAVIOR_LABELS: Record<PartnerBehavior, string> = {
  idle: "安静",
  reading: "看书",
  thinking: "思考",
  lookingAround: "张望",
  stretching: "伸懒腰",
  sleeping: "打盹",
};

// ===== 行为权重配置 =====

interface BehaviorWeights {
  idle: number;
  reading: number;
  thinking: number;
  lookingAround: number;
  stretching: number;
  sleeping: number;
}

/** 根据顶级状态，返回不同的行为权重 */
function getWeightsForState(topState: PartnerState): BehaviorWeights {
  switch (topState) {
    case "studying":
      return { idle: 20, reading: 40, thinking: 25, lookingAround: 5, stretching: 5, sleeping: 5 };
    case "resting":
      return { idle: 15, reading: 5, thinking: 5, lookingAround: 5, stretching: 5, sleeping: 65 };
    case "happy":
      return { idle: 20, reading: 10, thinking: 10, lookingAround: 30, stretching: 25, sleeping: 5 };
    default: // calm
      return { idle: 35, reading: 20, thinking: 15, lookingAround: 15, stretching: 10, sleeping: 5 };
  }
}

/** 加权随机选择 */
function pickWeighted(weights: BehaviorWeights): PartnerBehavior {
  const entries = Object.entries(weights) as [PartnerBehavior, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let rand = Math.random() * total;
  for (const [behavior, weight] of entries) {
    rand -= weight;
    if (rand <= 0) return behavior;
  }
  return "idle";
}

/** 排除与前一行为相同的，避免连续重复 */
function pickNext(weights: BehaviorWeights, previous: PartnerBehavior): PartnerBehavior {
  let next = pickWeighted(weights);
  let attempts = 0;
  while (next === previous && attempts < 5) {
    next = pickWeighted(weights);
    attempts++;
  }
  return next;
}

/** 随机间隔 30~90 秒（毫秒） */
function randomInterval(): number {
  return 30000 + Math.random() * 60000;
}

// ===== React Hook =====

export function usePartnerBehavior(topState: PartnerState): PartnerBehavior {
  const [behavior, setBehavior] = useState<PartnerBehavior>("idle");
  const previousRef = useRef<PartnerBehavior>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    const weights = getWeightsForState(topState);
    const next = pickNext(weights, previousRef.current);
    previousRef.current = next;
    setBehavior(next);

    timerRef.current = setTimeout(() => {
      scheduleNext();
    }, randomInterval());
  }, [topState]);

  // 初始化 + topState 变化时重置
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // 初始延迟 1~3 秒后开始
    const initialDelay = 1000 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      scheduleNext();
    }, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [topState, scheduleNext]);

  // 如果是 resting 状态且当前是 sleeping，保留；否则首次 idle
  return behavior;
}
