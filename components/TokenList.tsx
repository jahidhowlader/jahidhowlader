import styles from "./TokenList.module.css";

/**
 * Renders a `A · B · C` sequence that wraps cleanly. Separators are attached
 * to the end of each item, so a wrap can never strand a leading "·".
 */
export function TokenList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`label ${styles.list} ${className}`}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
