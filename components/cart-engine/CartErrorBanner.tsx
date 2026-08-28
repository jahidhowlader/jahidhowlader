"use client";

import styles from "./CartErrorBanner.module.css";

export function CartErrorBanner({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  if (!message) return null;
  return (
    <div className={styles.banner} role="alert">
      <p className={styles.text}>
        <span className="label">Error </span>
        {message}
      </p>
      <button type="button" className={styles.dismiss} onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
