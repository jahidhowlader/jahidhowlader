"use client";

import { useCartEngine } from "./CartEngineContext";
import { CartItemsList } from "./CartItemsList";
import { CartSummary } from "./CartSummary";
import { RewardSection } from "./RewardSection";
import styles from "./HostileCssZone.module.css";

/**
 * Renders the SAME cart components used in the drawer above, but nested
 * inside a container with deliberately adversarial CSS — generic button and
 * ".product" rules, forced box-sizing, oversized type. It's the same live
 * state, so interacting with quantity here updates the drawer too.
 */
export function HostileCssZone() {
  const { state, orderTotals, rewardProgress, changeQuantity, removeItem } = useCartEngine();

  return (
    <div className={styles.hostileZone}>
      <p className={styles.decoyCaption}>
        Decoys — plain host-page elements, unrelated to the cart:
      </p>
      <div className={styles.decoyRow}>
        <button type="button">Shop now</button>
        <div className="product">Featured product</div>
      </div>

      <p className={`label ${styles.previewLabel}`}>Same cart component, live, right here:</p>
      <div className={styles.previewCard}>
        <CartItemsList
          items={state.items}
          pending={state.pending}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
        />
        {state.items.length > 0 ? (
          <>
            <RewardSection subtotal={orderTotals.subtotal} rewardProgress={rewardProgress} />
            <CartSummary orderTotals={orderTotals} />
          </>
        ) : null}
      </div>
    </div>
  );
}
