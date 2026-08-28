import type { RewardProgress } from "@/domain/cart-engine/rewards/rewards";
import { RewardProgressBar } from "./RewardProgressBar";
import { FreeGiftBanner } from "./FreeGiftBanner";
import styles from "./RewardSection.module.css";

/**
 * Sits between the drawer header and the (scrollable) item list, at a fixed
 * height regardless of how many rewards exist or unlock — cart items are
 * the drawer's main content and shouldn't get pushed down by promo copy.
 */
export function RewardSection({
  subtotal,
  rewardProgress,
}: {
  subtotal: number;
  rewardProgress: RewardProgress;
}) {
  const freeGiftUnlocked = rewardProgress.unlocked.some((reward) => reward.id === "free-gift");

  return (
    <div className={styles.section}>
      <RewardProgressBar subtotal={subtotal} rewardProgress={rewardProgress} />
      <FreeGiftBanner unlocked={freeGiftUnlocked} />
    </div>
  );
}
