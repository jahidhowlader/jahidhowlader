"use client";

import styles from "./QuantityControl.module.css";

export function QuantityControl({
  quantity,
  itemName,
  pending,
  onIncrease,
  onDecrease,
  minQuantity = 1,
}: {
  quantity: number;
  itemName: string;
  pending: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
}) {
  return (
    <div className={styles.control}>
      <button
        type="button"
        className={styles.button}
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        aria-label={`Decrease quantity of ${itemName}`}
      >
        <span aria-hidden="true">−</span>
      </button>

      {/* Rapid clicks are handled by the domain layer's stale-response
          guard, so these buttons stay enabled while a request is pending —
          disabling them would hide the exact behaviour this demo shows. */}
      <span className={styles.quantity} aria-live="polite" aria-atomic="true">
        {quantity}
        {pending ? <span className={styles.srOnly}> (updating)</span> : null}
      </span>

      <button
        type="button"
        className={styles.button}
        onClick={onIncrease}
        aria-label={`Increase quantity of ${itemName}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
