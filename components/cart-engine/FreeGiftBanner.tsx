import styles from "./FreeGiftBanner.module.css";

export function FreeGiftBanner({ unlocked }: { unlocked: boolean }) {
  if (!unlocked) return null;
  return (
    <p className={styles.banner} role="status">
      <span aria-hidden="true">🎁 </span>
      You&rsquo;ve unlocked a free gift — added to your cart below.
    </p>
  );
}
