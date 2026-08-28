"use client";

import { totalItemCount } from "@/domain/cart-engine/cart/selectors";
import { useCartEngine } from "./CartEngineContext";
import styles from "./CartTriggerButton.module.css";

export function CartTriggerButton() {
  const { state, openDrawer, triggerRef } = useCartEngine();
  const count = totalItemCount(state.items);

  return (
    <button
      ref={triggerRef}
      type="button"
      className={styles.trigger}
      onClick={openDrawer}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      Cart
      <span className={styles.badge} aria-hidden="true">
        {count}
      </span>
    </button>
  );
}
