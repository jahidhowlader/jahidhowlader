import Link from "next/link";
import { nav, site } from "@/content/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.name}>
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.list}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`label ${styles.link}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
