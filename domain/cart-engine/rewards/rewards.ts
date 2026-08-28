export type FreeShippingReward = {
  id: string;
  threshold: number;
  kind: "free-shipping";
  label: string;
};

export type PercentDiscountReward = {
  id: string;
  threshold: number;
  kind: "percent-discount";
  percent: number;
  label: string;
};

export type FreeGiftReward = {
  id: string;
  threshold: number;
  kind: "free-gift";
  /** Which catalogue product gets added, at $0, once this unlocks. */
  giftProductId: string;
  label: string;
};

export type Reward = FreeShippingReward | PercentDiscountReward | FreeGiftReward;

/** Rounded, easy-to-verify thresholds — a real promotion ladder, not arbitrary numbers. */
export const REWARDS: Reward[] = [
  { id: "free-shipping", threshold: 50, kind: "free-shipping", label: "Free Shipping" },
  { id: "discount-10", threshold: 75, kind: "percent-discount", percent: 10, label: "10% Off" },
  {
    id: "free-gift",
    threshold: 100,
    kind: "free-gift",
    giftProductId: "canvas-tote",
    label: "Free Gift",
  },
];

export function isFreeShippingReward(reward: Reward): reward is FreeShippingReward {
  return reward.kind === "free-shipping";
}

export function isPercentDiscountReward(reward: Reward): reward is PercentDiscountReward {
  return reward.kind === "percent-discount";
}

export function isFreeGiftReward(reward: Reward): reward is FreeGiftReward {
  return reward.kind === "free-gift";
}

export type RewardProgress = {
  unlocked: Reward[];
  next: Reward | null;
  remainingToNext: number;
  /** 0–1, position within the segment leading up to `next`. */
  progressToNext: number;
};

function sortedByThreshold(rewards: Reward[]): Reward[] {
  return [...rewards].sort((a, b) => a.threshold - b.threshold);
}

export function getUnlockedRewards(subtotal: number, rewards: Reward[] = REWARDS): Reward[] {
  return sortedByThreshold(rewards).filter((reward) => subtotal >= reward.threshold);
}

export function getNextReward(subtotal: number, rewards: Reward[] = REWARDS): Reward | null {
  return sortedByThreshold(rewards).find((reward) => subtotal < reward.threshold) ?? null;
}

export function getRewardProgress(subtotal: number, rewards: Reward[] = REWARDS): RewardProgress {
  const sorted = sortedByThreshold(rewards);
  const unlocked = sorted.filter((reward) => subtotal >= reward.threshold);
  const next = sorted.find((reward) => subtotal < reward.threshold) ?? null;

  if (!next) {
    return { unlocked, next: null, remainingToNext: 0, progressToNext: 1 };
  }

  // Progress is relative to the segment between the last unlocked threshold
  // and the next one, not to the next threshold alone — otherwise the bar
  // would jump backwards the moment an earlier reward unlocks.
  const previousThreshold = unlocked.at(-1)?.threshold ?? 0;
  const span = next.threshold - previousThreshold;
  const progressToNext = span <= 0 ? 1 : Math.min(1, Math.max(0, (subtotal - previousThreshold) / span));

  return {
    unlocked,
    next,
    remainingToNext: Math.max(0, next.threshold - subtotal),
    progressToNext,
  };
}
