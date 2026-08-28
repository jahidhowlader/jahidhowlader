import Link from "next/link";
import styles from "./CaseStudyNav.module.css";

export function CaseStudyNav({ title }: { title: string }) {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <Link href="/#work" className={`label ${styles.back}`}>
          <span aria-hidden="true">← </span>Work
        </Link>
        <p className={`label ${styles.title}`}>{title}</p>
      </div>
      {/* Scroll position, driven entirely by CSS. Hidden where the timeline
          isn't supported, so it can never sit at zero and look broken. */}
      <div className={styles.progress} aria-hidden="true" />
    </div>
  );
}
