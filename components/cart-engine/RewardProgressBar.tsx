"use client";

import { formatCurrency } from "@/lib/cart-engine/formatCurrency";
import { REWARDS, type RewardProgress } from "@/domain/cart-engine/rewards/rewards";
import styles from "./RewardProgressBar.module.css";

export function RewardProgressBar({
  subtotal,
  rewardProgress,
}: {
  subtotal: number;
  rewardProgress: RewardProgress;
}) {
  const { next, progressToNext, remainingToNext, unlocked } = rewardProgress;
  const unlockedIds = new Set(unlocked.map((reward) => reward.id));

  // Every reward unlocked collapses to a single compact line instead of a
  // progress bar and reward list nobody needs to check anymore — the reward
  // section should never be the tallest thing in the drawer.
  if (!next) {
    return (
      <p className={styles.allUnlocked}>
        <span aria-hidden="true">✓ </span>
        All rewards unlocked
      </p>
    );
  }

  const percent = Math.round(progressToNext * 100);
  const valueText = `${formatCurrency(subtotal)} of ${formatCurrency(next.threshold)} toward ${next.label}`;

  return (
    <div className={styles.wrap}>
      <p className={styles.status}>
        {`Spend ${formatCurrency(remainingToNext)} more to unlock ${next.label}`}
      </p>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={valueText}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>

      {/* A compact horizontal row rather than a stacked list — unlocked
          state is carried by the "✓" and text weight, not by color alone. */}
      <ul className={styles.rewardRow}>
        {REWARDS.map((reward) => {
          const isUnlocked = unlockedIds.has(reward.id);
          return (
            <li key={reward.id} className={isUnlocked ? styles.unlocked : styles.locked}>
              {isUnlocked ? "✓ " : ""}
              {reward.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
