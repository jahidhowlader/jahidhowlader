import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content/types";
import { TokenList } from "./TokenList";
import styles from "./ProjectRow.module.css";

export function ProjectRow({ project, order }: { project: Project; order: number }) {
  const { category, title, summary, stack, links, emphasis } = project;

  return (
    <article
      className={`${styles.row} ${emphasis === "primary" ? styles.primary : ""}`}
      data-reveal
      style={{ "--reveal-delay": `${order * 60}ms` } as CSSProperties}
    >
      <p className={`label ${styles.category}`}>{category}</p>

      <h3 className={styles.title}>{title}</h3>

      <p className={`${styles.summary} measure`}>{summary}</p>

      <TokenList items={stack} className={styles.stack} />

      <ul className={styles.links}>
        {links.map((link) =>
          link.external ? (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <span aria-hidden="true" className={styles.marker}>
                  ↗
                </span>
                <span className={styles.srOnly}>(opens in a new tab)</span>
              </a>
            </li>
          ) : (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
                <span aria-hidden="true" className={`${styles.marker} ${styles.arrow}`}>
                  →
                </span>
              </Link>
            </li>
          ),
        )}
      </ul>
    </article>
  );
}
