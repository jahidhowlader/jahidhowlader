"use client";

import { useEffect, useRef } from "react";
import { useCartEngine } from "./CartEngineContext";
import { CartItemsList } from "./CartItemsList";
import { CartSummary } from "./CartSummary";
import { CartErrorBanner } from "./CartErrorBanner";
import { RewardSection } from "./RewardSection";
import styles from "./CartDrawer.module.css";

/**
 * Built on the native <dialog> element rather than a hand-rolled modal:
 * showModal() gives real focus containment (Tab stays inside), Escape
 * closes it for free, and focus returns to the invoking button on close —
 * all without a dependency or a manual focus-trap loop.
 */
export function CartDrawer() {
  const {
    state,
    orderTotals,
    rewardProgress,
    drawerOpen,
    closeDrawer,
    triggerRef,
    changeQuantity,
    removeItem,
    dismissError,
  } = useCartEngine();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Deliberately no dependency array: this reconciles against the native
  // dialog's ACTUAL open state on every render, rather than diffing
  // `drawerOpen` against its previous value. A close (native "close" event)
  // followed immediately by an add-to-cart's setDrawerOpen(true) can land
  // in the same React batch and net out to "no change" from React's point
  // of view — which would make a value-diffed effect skip re-opening the
  // dialog even though it's actually closed. Comparing to `dialog.open`
  // directly is self-correcting regardless of how the state got there.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!drawerOpen && dialog.open) {
      dialog.close();
    }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Fires on Escape (native "cancel" -> "close") and on our own close()
    // call above, so both paths restore focus the same way.
    const handleClose = () => {
      closeDrawer();
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [closeDrawer, triggerRef]);

  useEffect(() => {
    // A modal <dialog> closes on Escape natively, via the "cancel" event
    // above. This listener is a deliberate second path to the same
    // outcome — cheap, and it means Escape is guaranteed to close the
    // drawer even in a host environment where the native default action
    // doesn't fire, rather than depending silently on one code path.
    const dialog = dialogRef.current;
    if (!dialog || !drawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  const hasItems = state.items.length > 0;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="cart-drawer-heading"
      onClick={(event) => {
        if (event.target === dialogRef.current) closeDrawer();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <h3 id="cart-drawer-heading" className={styles.heading}>
            Your cart
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.close}
            onClick={closeDrawer}
          >
            <span aria-hidden="true">×</span>
            <span className={styles.srOnly}>Close cart</span>
          </button>
        </div>

        {hasItems ? (
          <RewardSection subtotal={orderTotals.subtotal} rewardProgress={rewardProgress} />
        ) : null}

        {/*
          This is the ONLY scrollable region in the drawer. The header,
          reward section and footer are all flex-shrink: 0, so a long cart
          scrolls its own item list instead of growing the whole dialog.
        */}
        <div className={styles.body}>
          <CartErrorBanner message={state.error} onDismiss={dismissError} />
          <CartItemsList
            items={state.items}
            pending={state.pending}
            onQuantityChange={changeQuantity}
            onRemove={removeItem}
          />
        </div>

        {hasItems ? (
          <div className={styles.footer}>
            <CartSummary orderTotals={orderTotals} />
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
