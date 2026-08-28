import type { CartItem } from "./types.ts";
import { fromCents, toCents } from "../../../lib/cart-engine/money.ts";
import {
  getUnlockedRewards,
  isFreeShippingReward,
  isPercentDiscountReward,
  REWARDS,
  type Reward,
} from "../rewards/rewards.ts";

/** The gift is a real line so it renders like one, but it's worth $0 and must never count toward the subtotal a discount is computed from. */
function paidItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => !item.isGift);
}

export function calculateSubtotalCents(items: CartItem[]): number {
  return paidItems(items).reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);
}

export function calculateSubtotal(items: CartItem[]): number {
  return fromCents(calculateSubtotalCents(items));
}

export function totalItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

const BASE_SHIPPING_CENTS = 500;

export type OrderTotals = {
  subtotal: number;
  discount: number;
  discountPercent: number | null;
  shipping: number;
  freeShipping: boolean;
  total: number;
};

/**
 * Every figure here is derived from `items` and the reward ladder on every
 * call — nothing is cached or set by hand, so a quantity change, a removed
 * line, or a rolled-back optimistic update always produces a consistent set
 * of numbers instead of a stale discount next to a fresh subtotal.
 */
export function calculateOrderTotals(items: CartItem[], rewards: Reward[] = REWARDS): OrderTotals {
  const subtotalCents = calculateSubtotalCents(items);
  const unlocked = getUnlockedRewards(fromCents(subtotalCents), rewards);

  const discountReward = unlocked.find(isPercentDiscountReward);
  const discountPercent = discountReward ? discountReward.percent : null;
  const discountCents = discountPercent ? Math.round((subtotalCents * discountPercent) / 100) : 0;

  const freeShipping = unlocked.some(isFreeShippingReward);
  const shippingCents = subtotalCents === 0 ? 0 : freeShipping ? 0 : BASE_SHIPPING_CENTS;

  const totalCents = subtotalCents - discountCents + shippingCents;

  return {
    subtotal: fromCents(subtotalCents),
    discount: fromCents(discountCents),
    discountPercent,
    shipping: fromCents(shippingCents),
    freeShipping,
    total: fromCents(totalCents),
  };
}
