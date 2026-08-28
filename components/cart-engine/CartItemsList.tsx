"use client";

import type { CartItem, PendingUpdate } from "@/domain/cart-engine/cart/types";
import { CartItemRow } from "./CartItemRow";
import styles from "./CartItemsList.module.css";

export function CartItemsList({
  items,
  pending,
  onQuantityChange,
  onRemove,
}: {
  items: CartItem[];
  pending: Record<string, PendingUpdate>;
  onQuantityChange: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <svg
          className={styles.emptyIcon}
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            d="M8 14h32l-3 20a3 3 0 0 1-3 2.6H14a3 3 0 0 1-3-2.6z"
            strokeLinejoin="round"
          />
          <path d="M16 14v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
        </svg>
        <p className={styles.emptyText}>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.lineId}>
          <CartItemRow
            item={item}
            pending={Boolean(pending[item.lineId])}
            onIncrease={() => onQuantityChange(item.lineId, 1)}
            onDecrease={() => onQuantityChange(item.lineId, -1)}
            onRemove={() => onRemove(item.lineId)}
          />
        </li>
      ))}
    </ul>
  );
}
