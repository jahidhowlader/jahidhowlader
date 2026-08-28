import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  /** Zero-padded index rendered decoratively, e.g. "01". */
  index: string;
  /** Section name, announced to assistive tech as the heading. */
  name: string;
  children: ReactNode;
};

export function Section({ id, index, name, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={`container ${styles.inner}`}>
        <h2 id={`${id}-heading`} className={`label ${styles.heading}`}>
          <span aria-hidden="true">{index} / </span>
          {name}
        </h2>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
