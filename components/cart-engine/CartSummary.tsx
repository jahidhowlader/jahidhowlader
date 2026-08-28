import { formatCurrency } from "@/lib/cart-engine/formatCurrency";
import type { OrderTotals } from "@/domain/cart-engine/cart/selectors";
import styles from "./CartSummary.module.css";

/**
 * Totals and checkout only — this is the fixed footer of the drawer, so it
 * deliberately excludes reward/gift messaging (that lives in its own
 * compact section higher up) to stay a predictable, small height.
 */
export function CartSummary({ orderTotals }: { orderTotals: OrderTotals }) {
  const { subtotal, discount, discountPercent, shipping, freeShipping, total } = orderTotals;

  return (
    <div className={styles.summary}>
      <dl className={styles.totals}>
        <div className={styles.row}>
          <dt className="label">Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>

        {discountPercent !== null ? (
          <div className={styles.row}>
            <dt className="label">{discountPercent}% discount</dt>
            <dd className={styles.discount}>−{formatCurrency(discount)}</dd>
          </div>
        ) : null}

        <div className={styles.row}>
          <dt className="label">Shipping</dt>
          <dd className={freeShipping ? styles.free : undefined}>
            {freeShipping ? "Free" : formatCurrency(shipping)}
          </dd>
        </div>

        <div className={`${styles.row} ${styles.totalRow}`}>
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>

      <button type="button" className={styles.checkout}>
        Checkout
      </button>
      <p className={styles.checkoutNote}>Demo only — no real checkout or payment happens here.</p>
    </div>
  );
}
