"use client";

import { DemoControls } from "./DemoControls";
import { CartTriggerButton } from "./CartTriggerButton";
import { CartDrawer } from "./CartDrawer";
import styles from "./CartLiveArea.module.css";

export function CartLiveArea() {
  return (
    <div className={styles.area}>
      <DemoControls />
      <div className={styles.triggerRow}>
        <CartTriggerButton />
        <p className={styles.hint}>Add a product, then open the cart to try it.</p>
      </div>
      <CartDrawer />
    </div>
  );
}
