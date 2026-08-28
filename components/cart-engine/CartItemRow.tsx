"use client";

import { formatCurrency } from "@/lib/cart-engine/formatCurrency";
import type { CartItem } from "@/domain/cart-engine/cart/types";
import { ProductImage } from "./ProductImage";
import { QuantityControl } from "./QuantityControl";
import styles from "./CartItemRow.module.css";

function variantSummary(item: CartItem): string | null {
  if (!item.variants) return null;
  return Object.entries(item.variants)
    .map(([group, value]) => `${group}: ${value}`)
    .join(" · ");
}

export function CartItemRow({
  item,
  pending,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  pending: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const variants = variantSummary(item);

  return (
    <div className={styles.row} aria-busy={pending}>
      <ProductImage image={item.image} size={56} />

      <div className={styles.info}>
        <p className={styles.name}>
          {item.name}
          {item.isGift ? <span className={styles.giftTag}>Free gift</span> : null}
        </p>
        {variants ? <p className={styles.variants}>{variants}</p> : null}
        {item.isGift ? (
          <p className={styles.price}>
            <span className={styles.strike}>{formatCurrency(item.originalPrice ?? 0)}</span>
          </p>
        ) : (
          <p className={styles.price}>{formatCurrency(item.price)} each</p>
        )}
      </div>

      <div className={styles.actions}>
        {item.isGift ? (
          <>
            <span className={styles.freeLabel}>FREE</span>
            <p className={styles.giftNote}>Added automatically</p>
          </>
        ) : (
          <>
            <QuantityControl
              quantity={item.quantity}
              itemName={item.name}
              pending={pending}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />

            <p className={styles.lineTotal}>{formatCurrency(item.price * item.quantity)}</p>

            <button type="button" className={styles.remove} onClick={onRemove}>
              Remove
              <span className={styles.srOnly}>{` ${item.name} from cart`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
