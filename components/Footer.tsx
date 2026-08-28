import { site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className="label">
          {site.name} · {new Date().getFullYear()}
        </p>
        <p className="label">{site.location}</p>
      </div>
    </footer>
  );
}
